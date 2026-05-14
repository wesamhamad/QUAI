import os

# Text chunking
MAX_CHUNK_SIZE = int(os.getenv("EXTRACT_MAX_CHUNK_SIZE", "4000"))

# File size limit (MB)
MAX_FILE_SIZE_MB = int(os.getenv("EXTRACT_MAX_FILE_SIZE_MB", "20"))

# OCR settings
OCR_LANGUAGES = os.getenv("EXTRACT_OCR_LANGUAGES", "ara+eng")
OCR_DPI = int(os.getenv("EXTRACT_OCR_DPI", "300"))

# If a PDF page yields fewer characters than this, it's considered scanned
SCANNED_PAGE_TEXT_THRESHOLD = int(os.getenv("EXTRACT_SCANNED_THRESHOLD", "50"))

# Logging
LOG_LEVEL = os.getenv("EXTRACT_LOG_LEVEL", "INFO")
