from .base import BaseExtractor


class TextExtractor(BaseExtractor):
    def extract(self, file_path: str) -> dict:
        with open(file_path, "r", encoding="utf-8", errors="replace") as f:
            content = f.read()

        return {
            "content": content,
            "page_count": None,
            "ocr_applied": False,
            "language_detected": self.detect_language(content),
        }
