import os

# Embedding model
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")

# ChromaDB persistence
CHROMA_PERSIST_DIR = os.getenv("CHROMA_PERSIST_DIR", "/data/chromadb")
CHROMA_COLLECTION = os.getenv("CHROMA_COLLECTION", "advisor_knowledge")

# Search defaults
DEFAULT_TOP_K = int(os.getenv("DEFAULT_TOP_K", "10"))

# Chunking for indexing
CHUNK_SIZE = int(os.getenv("CHUNK_SIZE", "500"))
CHUNK_OVERLAP = int(os.getenv("CHUNK_OVERLAP", "100"))

# Logging
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")

