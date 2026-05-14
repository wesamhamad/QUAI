import logging
import os
import shutil
import subprocess
import tempfile
import time

from fastapi import FastAPI, File, HTTPException, UploadFile

from config import LOG_LEVEL, MAX_CHUNK_SIZE, MAX_FILE_SIZE_MB
from extractors import EXTRACTOR_MAP, get_extractor
from models import ExtractionResult, HealthResponse

logging.basicConfig(
    level=getattr(logging, LOG_LEVEL),
    format="%(asctime)s %(levelname)-7s [%(name)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("file_extraction")

app = FastAPI(
    title="QUAI File Extraction Service",
    description="Arabic-supported file text extraction microservice for QUAI platform",
    version="1.0.0",
)

SUPPORTED_EXTENSIONS = set(EXTRACTOR_MAP.keys())


@app.post("/extract", response_model=ExtractionResult)
async def extract(file: UploadFile = File(...)):
    request_start = time.time()

    # Validate file extension
    filename = file.filename or "unknown"
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""

    logger.info("=" * 70)
    logger.info("[REQUEST] POST /extract — filename=%s, type=.%s, content_type=%s",
                filename, ext, file.content_type)

    if ext not in SUPPORTED_EXTENSIONS:
        logger.warning("[REQUEST] Rejected: unsupported extension .%s (supported: %s)",
                       ext, ", ".join(sorted(SUPPORTED_EXTENSIONS)))
        raise HTTPException(
            status_code=422,
            detail=(
                f"Unsupported file type: .{ext}. "
                f"Supported: {', '.join(sorted(SUPPORTED_EXTENSIONS))}"
            ),
        )

    # Validate file size
    contents = await file.read()
    size_mb = len(contents) / (1024 * 1024)
    logger.info("[REQUEST] File size: %.2f MB (%d bytes)", size_mb, len(contents))

    if size_mb > MAX_FILE_SIZE_MB:
        logger.warning("[REQUEST] Rejected: file too large (%.1f MB > %d MB limit)",
                       size_mb, MAX_FILE_SIZE_MB)
        raise HTTPException(
            status_code=413,
            detail=f"File too large ({size_mb:.1f}MB). Maximum: {MAX_FILE_SIZE_MB}MB",
        )

    # Write to temp file and extract
    tmp_dir = tempfile.mkdtemp()
    tmp_path = os.path.join(tmp_dir, filename)
    logger.info("[REQUEST] Temp path: %s", tmp_path)

    try:
        with open(tmp_path, "wb") as f:
            f.write(contents)
        logger.info("[REQUEST] File written to disk — starting extraction...")

        extractor = get_extractor(ext)
        logger.info("[REQUEST] Using extractor: %s", type(extractor).__name__)

        extract_start = time.time()
        result = extractor.extract(tmp_path)
        extract_elapsed = time.time() - extract_start

        content = result["content"]
        char_count = len(content)
        page_count = result.get("page_count")
        ocr_applied = result.get("ocr_applied", False)
        lang = result.get("language_detected")

        logger.info("[REQUEST] Extraction completed in %.2fs", extract_elapsed)
        logger.info("[REQUEST] Result: %d chars, %s pages, ocr=%s, lang=%s",
                    char_count, page_count, ocr_applied, lang)

        # Build chunks
        chunks = []
        for i in range(0, max(len(content), 1), MAX_CHUNK_SIZE):
            chunk = content[i : i + MAX_CHUNK_SIZE]
            if chunk:
                chunks.append(chunk)
        if not chunks:
            chunks = [""]

        logger.info("[REQUEST] Split into %d chunks (max %d chars each)",
                    len(chunks), MAX_CHUNK_SIZE)

        # Quick content quality check — log key indicators
        has_page_markers = "--- صفحة" in content or "--- Page" in content
        arabic_chars = sum(1 for c in content if '\u0600' <= c <= '\u06FF')
        logger.info("[REQUEST] Quality: page_markers=%s, arabic_chars=%d (%.0f%%)",
                    has_page_markers, arabic_chars,
                    (arabic_chars / char_count * 100) if char_count else 0)

        total_elapsed = time.time() - request_start
        logger.info("[REQUEST] Total request time: %.2fs", total_elapsed)
        logger.info("=" * 70)

        return ExtractionResult(
            filename=filename,
            file_type=ext,
            content=content,
            chunks=chunks,
            char_count=char_count,
            page_count=page_count,
            ocr_applied=ocr_applied,
            truncated=False,
            language_detected=lang,
        )
    except ValueError as e:
        logger.error("[REQUEST] ValueError for %s: %s", filename, e)
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        total_elapsed = time.time() - request_start
        logger.error("[REQUEST] FAILED for %s after %.2fs: %s",
                     filename, total_elapsed, e, exc_info=True)
        raise HTTPException(status_code=500, detail=f"Extraction failed: {e}")
    finally:
        shutil.rmtree(tmp_dir, ignore_errors=True)
        logger.debug("[REQUEST] Cleaned up temp dir: %s", tmp_dir)


@app.get("/health", response_model=HealthResponse)
async def health():
    logger.debug("[HEALTH] Health check requested")
    tess_available = False
    tess_languages: list[str] = []

    try:
        result = subprocess.run(
            ["tesseract", "--list-langs"],
            capture_output=True,
            text=True,
            timeout=5,
        )
        if result.returncode == 0:
            tess_available = True
            lines = result.stdout.strip().split("\n")
            # First line is the path header, languages start from line 2
            tess_languages = [lang.strip() for lang in lines[1:] if lang.strip()]
            logger.debug("[HEALTH] Tesseract OK — langs: %s", tess_languages)
    except FileNotFoundError:
        logger.warning("[HEALTH] tesseract not found in PATH")
    except Exception as e:
        logger.warning("[HEALTH] tesseract check failed: %s", e)

    status = "healthy" if tess_available else "degraded"
    logger.debug("[HEALTH] Status: %s", status)

    return HealthResponse(
        status=status,
        version="1.0.0",
        tesseract_available=tess_available,
        tesseract_languages=tess_languages,
    )
