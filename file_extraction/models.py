from pydantic import BaseModel
from typing import Optional


class ExtractionResult(BaseModel):
    filename: str
    file_type: str
    content: str
    chunks: list[str]
    char_count: int
    page_count: Optional[int] = None
    ocr_applied: bool = False
    truncated: bool = False
    language_detected: Optional[str] = None


class HealthResponse(BaseModel):
    status: str
    version: str
    tesseract_available: bool
    tesseract_languages: list[str]
