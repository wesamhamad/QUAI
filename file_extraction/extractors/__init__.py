from .pdf_extractor import PdfExtractor
from .docx_extractor import DocxExtractor
from .pptx_extractor import PptxExtractor
from .text_extractor import TextExtractor

EXTRACTOR_MAP = {
    "pdf": PdfExtractor,
    "docx": DocxExtractor,
    "doc": DocxExtractor,
    "pptx": PptxExtractor,
    "txt": TextExtractor,
    "md": TextExtractor,
    "csv": TextExtractor,
    "json": TextExtractor,
}


def get_extractor(extension: str):
    ext = extension.lower().lstrip(".")
    cls = EXTRACTOR_MAP.get(ext)
    if cls is None:
        raise ValueError(f"Unsupported file type: {ext}")
    return cls()
