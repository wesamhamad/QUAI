# QU‑LLM Assistant — Arabic Qassim‑University Advisor (OpenAI + RAG)

Production‑grade student advisor for Qassim University. Retrieves from official Qassim‑University documents and answers in Arabic with citations, powered by OpenAI.

## Why this design
The previous `wesam3/qu-llm-assistant` was a fine‑tuned 1.5 B model trained on auto‑generated Q&A whose answers echoed the question. The professional fix is **retrieval‑augmented generation with OpenAI** — answers are grounded in the source documents, every claim has a citation, and the corpus updates instantly without re‑training.

## Quick start

```bash
# 1. Install (uv recommended)
uv venv && source .venv/bin/activate
uv pip install -e .

# 2. Configure
cp .env.example .env
# edit .env to add OPENAI_API_KEY

# 3. Get source documents
qu scrape           # scrape qu.edu.sa public content into data/sources/raw/
# or drop your own PDFs/HTML into data/sources/upload/

# 4. Build the index
qu ingest

# 5. Ask a question
qu ask "كيف أتقدم لطلب إعادة تقييم الدرجات؟"

# 6. Run the web UI
qu serve            # FastAPI + Gradio at http://localhost:8000
```

## Evaluation

```bash
qu eval generate          # OpenAI‑synthesized 150‑item eval set from indexed docs
qu eval run rag           # run RAG pipeline over eval set
qu eval run baseline      # run wesam3/qu-llm-assistant via Ollama (must be running)
qu eval compare           # side‑by‑side report
```

## Layout
```
src/qu_assistant/
├── config.py            # env/settings
├── ingest/              # PDF/HTML/TXT loaders, chunker, scraper
├── retrieval/           # embeddings + LanceDB vector store
├── answer/              # OpenAI RAG answer engine (prompt caching, citations)
├── server/              # FastAPI + Gradio web UI
└── eval/                # eval set generator, runner, judge, comparator
```
