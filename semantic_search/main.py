import hashlib
import logging
import re

import chromadb
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer

from config import (
    CHROMA_COLLECTION,
    CHROMA_PERSIST_DIR,
    CHUNK_OVERLAP,
    CHUNK_SIZE,
    DEFAULT_TOP_K,
    EMBEDDING_MODEL,
    LOG_LEVEL,
)

logging.basicConfig(level=getattr(logging, LOG_LEVEL))
logger = logging.getLogger("semantic_search")

app = FastAPI(
    title="QUAI Semantic Search Service",
    description="Arabic semantic search for Smart Advisor knowledge base",
    version="1.0.0",
)

# Initialize model and ChromaDB at startup
model: SentenceTransformer | None = None
chroma_client: chromadb.ClientAPI | None = None
collection: chromadb.Collection | None = None


@app.on_event("startup")
def startup():
    global model, chroma_client, collection
    logger.info(f"Loading embedding model: {EMBEDDING_MODEL}")
    model = SentenceTransformer(EMBEDDING_MODEL)
    logger.info("Model loaded successfully")

    chroma_client = chromadb.PersistentClient(path=CHROMA_PERSIST_DIR)
    collection = chroma_client.get_or_create_collection(
        name=CHROMA_COLLECTION,
        metadata={"hnsw:space": "cosine"},
    )
    logger.info(f"ChromaDB collection '{CHROMA_COLLECTION}' ready with {collection.count()} documents")


# ── Request/Response Models ──


class IndexRequest(BaseModel):
    filename: str
    content: str
    source_file: str | None = None  # display name (e.g. PDF name without .extracted.txt)


class SearchRequest(BaseModel):
    query: str
    top_k: int = DEFAULT_TOP_K


class SearchResult(BaseModel):
    text: str
    source: str
    page: int | None = None
    score: float


class SearchResponse(BaseModel):
    results: list[SearchResult]
    query: str
    total_indexed: int


class IndexResponse(BaseModel):
    filename: str
    chunks_indexed: int
    total_indexed: int


class HealthResponse(BaseModel):
    status: str
    version: str
    model_loaded: bool
    total_indexed: int


# ── Helpers ──


def chunk_text(text: str, source: str) -> list[dict]:
    """Split text into overlapping chunks with page tracking."""
    chunks = []
    length = len(text)
    position = 0

    while position < length:
        chunk_text_str = text[position : position + CHUNK_SIZE]

        # Extract page number
        page = None
        page_match = re.search(r"---\s*(?:Page|صفحة)\s*(\d+)", chunk_text_str)
        if page_match:
            page = int(page_match.group(1))

        chunk_id = hashlib.md5(f"{source}:{position}".encode()).hexdigest()

        chunks.append(
            {
                "id": chunk_id,
                "text": chunk_text_str,
                "source": source,
                "page": page,
                "position": position,
            }
        )
        position += CHUNK_SIZE - CHUNK_OVERLAP

    return chunks


# ── Endpoints ──


@app.post("/index", response_model=IndexResponse)
async def index_document(req: IndexRequest):
    """Index a document for semantic search."""
    if not model or not collection:
        raise HTTPException(status_code=503, detail="Service not ready")

    source = req.source_file or req.filename
    chunks = chunk_text(req.content, source)

    if not chunks:
        return IndexResponse(filename=req.filename, chunks_indexed=0, total_indexed=collection.count())

    # Remove old chunks for this source first
    try:
        existing = collection.get(where={"source": source})
        if existing and existing["ids"]:
            collection.delete(ids=existing["ids"])
            logger.info(f"Removed {len(existing['ids'])} old chunks for {source}")
    except Exception:
        pass  # Collection might be empty

    texts = [c["text"] for c in chunks]
    embeddings = model.encode(texts, show_progress_bar=False).tolist()
    ids = [c["id"] for c in chunks]
    metadatas = [{"source": c["source"], "page": c["page"] or 0, "position": c["position"]} for c in chunks]

    collection.add(ids=ids, embeddings=embeddings, documents=texts, metadatas=metadatas)

    logger.info(f"Indexed {len(chunks)} chunks from {req.filename} (source: {source})")
    return IndexResponse(filename=req.filename, chunks_indexed=len(chunks), total_indexed=collection.count())


@app.post("/search", response_model=SearchResponse)
async def search(req: SearchRequest):
    """Search the knowledge base semantically."""
    if not model or not collection:
        raise HTTPException(status_code=503, detail="Service not ready")

    if collection.count() == 0:
        return SearchResponse(results=[], query=req.query, total_indexed=0)

    query_embedding = model.encode([req.query], show_progress_bar=False).tolist()
    results = collection.query(
        query_embeddings=query_embedding,
        n_results=min(req.top_k, collection.count()),
        include=["documents", "metadatas", "distances"],
    )

    search_results = []
    if results and results["documents"]:
        for doc, meta, dist in zip(
            results["documents"][0],
            results["metadatas"][0],
            results["distances"][0],
        ):
            # ChromaDB cosine distance: 0 = identical, 2 = opposite
            # Convert to similarity score: 1 - (distance / 2)
            score = 1.0 - (dist / 2.0)
            search_results.append(
                SearchResult(
                    text=doc,
                    source=meta.get("source", "unknown"),
                    page=meta.get("page") if meta.get("page", 0) > 0 else None,
                    score=round(score, 4),
                )
            )

    logger.info(f"Search '{req.query[:50]}...' returned {len(search_results)} results")
    return SearchResponse(results=search_results, query=req.query, total_indexed=collection.count())


@app.delete("/index")
async def clear_index():
    """Clear all indexed documents."""
    global collection
    if not chroma_client:
        raise HTTPException(status_code=503, detail="Service not ready")

    chroma_client.delete_collection(CHROMA_COLLECTION)
    collection = chroma_client.get_or_create_collection(
        name=CHROMA_COLLECTION,
        metadata={"hnsw:space": "cosine"},
    )

    logger.info("Index cleared")
    return {"message": "Index cleared", "total_indexed": 0}


@app.get("/health", response_model=HealthResponse)
async def health():
    return HealthResponse(
        status="healthy" if model else "degraded",
        version="1.0.0",
        model_loaded=model is not None,
        total_indexed=collection.count() if collection else 0,
    )
