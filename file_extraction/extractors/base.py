import re
from abc import ABC, abstractmethod
from typing import Optional


class BaseExtractor(ABC):
    @abstractmethod
    def extract(self, file_path: str) -> dict:
        """
        Returns dict with keys:
          - content: str (full extracted text)
          - page_count: Optional[int]
          - ocr_applied: bool
          - language_detected: Optional[str]
        """
        pass

    def detect_arabic(self, text: str) -> bool:
        """Check if text contains Arabic characters."""
        return bool(re.search(r"[\u0600-\u06FF]", text))

    def detect_language(self, text: str) -> Optional[str]:
        has_arabic = self.detect_arabic(text)
        has_latin = bool(re.search(r"[a-zA-Z]", text))
        if has_arabic and has_latin:
            return "mixed"
        elif has_arabic:
            return "ar"
        elif has_latin:
            return "en"
        return None
