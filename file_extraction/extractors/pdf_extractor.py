import io
import logging
import re
import shutil
import signal
import subprocess
import tempfile
from contextlib import contextmanager
from pathlib import Path

import fitz  # PyMuPDF
from PIL import Image

from config import OCR_DPI, OCR_LANGUAGES, SCANNED_PAGE_TEXT_THRESHOLD

from .base import BaseExtractor

logger = logging.getLogger("file_extraction.pdf")


class OcrTimeoutError(Exception):
    pass


@contextmanager
def ocr_timeout(seconds: int):
    """Context manager to enforce a per-page OCR timeout."""

    def handler(signum, frame):
        raise OcrTimeoutError(f"OCR timed out after {seconds}s")

    old = signal.signal(signal.SIGALRM, handler)
    signal.alarm(seconds)
    try:
        yield
    finally:
        signal.alarm(0)
        signal.signal(signal.SIGALRM, old)


class PdfExtractor(BaseExtractor):
    OCR_PAGE_TIMEOUT = 60  # seconds per page

    def extract(self, file_path: str) -> dict:
        """
        Extract text from PDF using a three-tier strategy:
        1. PyMuPDF (fitz) — best for Arabic text (preserves word boundaries)
        2. pdftotext (poppler) — fallback if PyMuPDF fails
        3. OCR (Tesseract) — for scanned/image-based pages
        """
        logger.info("=" * 70)
        logger.info("[EXTRACT] START — file: %s", file_path)
        logger.info("[EXTRACT] Strategy: Tier1=PyMuPDF → Tier2=pdftotext → Tier3=OCR")

        # Tier 1: Try PyMuPDF (preserves Arabic word boundaries much better)
        logger.info("[EXTRACT] Tier 1: Attempting PyMuPDF...")
        try:
            result = self._extract_with_pymupdf(file_path)
            content = result.get("content", "")
            if len(content.strip()) >= SCANNED_PAGE_TEXT_THRESHOLD:
                logger.info("[EXTRACT] Tier 1 SUCCESS — %d chars, %d pages, lang=%s",
                            len(content), result.get("page_count", 0),
                            result.get("language_detected"))
                logger.info("[EXTRACT] First 200 chars: %.200s",
                            content[:200].replace('\n', '\\n'))
                logger.info("=" * 70)
                return result
            else:
                logger.warning("[EXTRACT] Tier 1 output too short (%d chars) — trying Tier 2",
                               len(content.strip()))
        except Exception as e:
            logger.warning("[EXTRACT] Tier 1 (PyMuPDF) failed: %s — trying Tier 2", str(e))

        # Tier 2: Try pdftotext as fallback
        logger.info("[EXTRACT] Tier 2: Attempting pdftotext (poppler)...")
        pdftotext_result = self._extract_with_pdftotext(file_path)
        if pdftotext_result:
            text = pdftotext_result
            lang = self.detect_language(text)
            page_count = self._count_pages(file_path)
            logger.info("[EXTRACT] Tier 2 SUCCESS — %d chars, %d pages, lang=%s",
                        len(text), page_count or 0, lang)
            logger.info("[EXTRACT] First 200 chars: %.200s", text[:200].replace('\n', '\\n'))
            logger.info("=" * 70)
            return {
                "content": text,
                "page_count": page_count,
                "ocr_applied": False,
                "language_detected": lang,
            }

        logger.warning("[EXTRACT] Tier 2 also FAILED — no text extracted")
        logger.info("=" * 70)
        return {
            "content": "",
            "page_count": 0,
            "ocr_applied": False,
            "language_detected": "unknown",
        }

    @staticmethod
    def _clean_bidi_marks(text: str, page_num: int = 0) -> str:
        """Remove Unicode bidi control characters and Arabic visual artifacts."""
        original_len = len(text)

        # Remove bidi control chars + zero-width chars + soft hyphen
        bidi_chars = re.compile(
            r"[\u200e\u200f\u202a-\u202e\u2066-\u2069\ufeff\u200b-\u200d\u2060\u00ad]"
        )
        text = bidi_chars.sub("", text)
        bidi_removed = original_len - len(text)
        if bidi_removed > 0:
            logger.debug("[CLEAN p%d] Removed %d bidi/zero-width chars", page_num, bidi_removed)

        # Remove kashida / tatweel (ـ U+0640) used for visual stretching in PDFs
        kashida_count = text.count("\u0640")
        text = text.replace("\u0640", "")
        if kashida_count > 0:
            logger.debug("[CLEAN p%d] Removed %d kashida/tatweel chars", page_num, kashida_count)

        # Fix common broken Arabic ligatures produced by pdftotext
        ligature_fixes = 0
        # "أال" (alef-hamza + alef + lam) → "ألا" (alef-hamza + lam + alef)
        count = text.count("أال")
        if count:
            text = text.replace("أال", "ألا")
            ligature_fixes += count
            logger.debug("[CLEAN p%d] Fixed %d 'أال'→'ألا' ligatures", page_num, count)
        # "خال" → "خلال"  (common in "خلال فصل")
        count = text.count("خال ")
        if count:
            text = text.replace("خال ", "خلال ")
            ligature_fixes += count
            logger.debug("[CLEAN p%d] Fixed %d 'خال'→'خلال' ligatures", page_num, count)

        if ligature_fixes:
            logger.info("[CLEAN p%d] Total ligature fixes: %d", page_num, ligature_fixes)

        # Remove single spaces injected between Arabic letters within words
        arabic_char = r'[\u0600-\u06FF]'
        before_spacing = len(text)
        text = re.sub(
            rf'({arabic_char}) ({arabic_char}) ({arabic_char}) ({arabic_char}) ({arabic_char})',
            r'\1\2\3\4\5', text
        )
        text = re.sub(
            rf'({arabic_char}) ({arabic_char}) ({arabic_char}) ({arabic_char})',
            r'\1\2\3\4', text
        )
        text = re.sub(
            rf'({arabic_char}) ({arabic_char}) ({arabic_char})',
            r'\1\2\3', text
        )
        spacing_fixed = before_spacing - len(text)
        if spacing_fixed > 0:
            logger.debug("[CLEAN p%d] Collapsed %d inter-char spaces in Arabic words",
                         page_num, spacing_fixed)

        # Collapse multiple spaces/tabs (bidi removal can leave gaps)
        text = re.sub(r"[ \t]{2,}", " ", text)
        # Strip leading/trailing whitespace per line
        text = "\n".join(line.strip() for line in text.split("\n"))
        # Collapse 3+ consecutive blank lines into 1
        text = re.sub(r"\n{3,}", "\n\n", text)

        logger.debug("[CLEAN p%d] Result: %d chars (was %d, removed %d)",
                     page_num, len(text), original_len, original_len - len(text))
        return text

    def _extract_with_pdftotext(self, file_path: str) -> str | None:
        """
        Use poppler's pdftotext which handles Arabic bidi text correctly.
        Returns None if pdftotext is not available or fails.
        """
        pdftotext_path = shutil.which("pdftotext")
        if not pdftotext_path:
            logger.info("[PDFTOTEXT] Binary not found in PATH — skipping Tier 1")
            return None

        logger.info("[PDFTOTEXT] Binary found: %s", pdftotext_path)

        try:
            page_count = self._count_pages(file_path)
            if not page_count:
                logger.warning("[PDFTOTEXT] Could not determine page count — skipping")
                return None

            logger.info("[PDFTOTEXT] PDF has %d pages — extracting page-by-page", page_count)

            pages_text = []
            ocr_pages = []
            empty_pages = []

            for page_num in range(1, page_count + 1):
                cmd = ["pdftotext", "-f", str(page_num), "-l", str(page_num),
                       file_path, "-"]
                logger.debug("[PDFTOTEXT p%d] Running: %s", page_num, " ".join(cmd))

                result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)

                raw_len = len(result.stdout)
                if result.returncode != 0:
                    logger.warning("[PDFTOTEXT p%d] Exit code %d, stderr: %s",
                                   page_num, result.returncode, result.stderr.strip()[:200])

                text = self._clean_bidi_marks(result.stdout, page_num).strip()
                logger.debug("[PDFTOTEXT p%d] Raw: %d chars → Cleaned: %d chars",
                             page_num, raw_len, len(text))

                if not text:
                    logger.info("[PDFTOTEXT p%d] Empty after cleaning — trying OCR fallback",
                                page_num)
                    text = self._ocr_single_page(file_path, page_num)
                    if text:
                        ocr_pages.append(page_num)
                        logger.info("[PDFTOTEXT p%d] OCR produced %d chars", page_num, len(text))
                    else:
                        empty_pages.append(page_num)
                        logger.warning("[PDFTOTEXT p%d] OCR also empty — page skipped", page_num)

                if text:
                    page_label = f"\n--- صفحة {page_num} / Page {page_num} ---\n"
                    pages_text.append(page_label + text)
                    # Log a snippet of each page for debugging
                    snippet = text[:120].replace('\n', '\\n')
                    logger.debug("[PDFTOTEXT p%d] Snippet: %s", page_num, snippet)

            full_text = "\n".join(pages_text)

            # Summary
            logger.info("[PDFTOTEXT] Page summary: %d extracted, %d via OCR, %d empty",
                        len(pages_text), len(ocr_pages), len(empty_pages))
            if ocr_pages:
                logger.info("[PDFTOTEXT] OCR pages: %s", ocr_pages)
            if empty_pages:
                logger.info("[PDFTOTEXT] Empty/skipped pages: %s", empty_pages)
            logger.info("[PDFTOTEXT] Total output: %d chars", len(full_text.strip()))

            # Validate: if we got very little text, pdftotext may have failed
            if len(full_text.strip()) < SCANNED_PAGE_TEXT_THRESHOLD:
                logger.warning("[PDFTOTEXT] Output too short (%d chars < threshold %d) — falling back",
                               len(full_text.strip()), SCANNED_PAGE_TEXT_THRESHOLD)
                return None

            return full_text

        except subprocess.TimeoutExpired:
            logger.error("[PDFTOTEXT] Timeout (30s) expired while extracting a page")
            return None
        except FileNotFoundError as e:
            logger.error("[PDFTOTEXT] File not found: %s", e)
            return None
        except Exception as e:
            logger.error("[PDFTOTEXT] Unexpected error: %s", e, exc_info=True)
            return None

    def _count_pages(self, file_path: str) -> int | None:
        """Count PDF pages using PyMuPDF."""
        try:
            doc = fitz.open(file_path)
            count = len(doc)
            doc.close()
            logger.debug("[PAGES] PyMuPDF reports %d pages", count)
            return count
        except Exception as e:
            logger.error("[PAGES] Failed to count pages: %s", e)
            return None

    def _ocr_single_page(self, file_path: str, page_num: int) -> str | None:
        """OCR a single page by number (1-indexed) using PyMuPDF + Tesseract."""
        logger.debug("[OCR p%d] Starting single-page OCR", page_num)
        try:
            doc = fitz.open(file_path)
            page = doc[page_num - 1]
            text = self._ocr_page(page, page_num)
            doc.close()
            if text and text.strip():
                logger.debug("[OCR p%d] Got %d chars", page_num, len(text.strip()))
                return text.strip()
            logger.debug("[OCR p%d] No text produced", page_num)
            return None
        except Exception as e:
            logger.warning("[OCR p%d] Fallback failed: %s", page_num, e)
            return None

    def _extract_with_pymupdf(self, file_path: str) -> dict:
        """Tier 1: PyMuPDF extraction using word-level coordinates for proper RTL ordering."""
        logger.info("[PYMUPDF] Starting extraction with word-level RTL reordering")
        doc = fitz.open(file_path)
        logger.info("[PYMUPDF] Opened PDF: %d pages", len(doc))

        pages_text = []
        ocr_applied = False
        ocr_pages = []

        for page_num in range(len(doc)):
            page = doc[page_num]
            display_num = page_num + 1

            # Use word-level extraction for proper bidi handling
            text = self._extract_page_rtl(page, display_num)

            # If text is too short, page is likely scanned — use OCR
            if len(text.strip()) < SCANNED_PAGE_TEXT_THRESHOLD:
                logger.info("[PYMUPDF p%d] Short text (%d chars < %d) — trying OCR",
                            display_num, len(text.strip()), SCANNED_PAGE_TEXT_THRESHOLD)
                ocr_text = self._ocr_page(page, display_num)
                if ocr_text and ocr_text.strip():
                    text = ocr_text.strip()
                    ocr_applied = True
                    ocr_pages.append(display_num)
                    logger.info("[PYMUPDF p%d] OCR produced %d chars", display_num, len(text))
                else:
                    logger.warning("[PYMUPDF p%d] OCR also failed — page may be blank",
                                   display_num)

            if text.strip():
                text = self._clean_bidi_marks(text, display_num)
                page_label = f"\n--- صفحة {display_num} / Page {display_num} ---\n"
                pages_text.append(page_label + text)

        total_pages = len(doc)
        doc.close()
        full_text = "\n".join(pages_text)

        logger.info("[PYMUPDF] Summary: %d pages extracted, %d via OCR",
                    len(pages_text), len(ocr_pages))
        if ocr_pages:
            logger.info("[PYMUPDF] OCR pages: %s", ocr_pages)
        logger.info("[PYMUPDF] Total output: %d chars", len(full_text))

        return {
            "content": full_text,
            "page_count": total_pages,
            "ocr_applied": ocr_applied,
            "language_detected": self.detect_language(full_text),
        }

    def _extract_page_rtl(self, page, display_num: int) -> str:
        """Extract text from a page using word coordinates, sorting RTL for Arabic.
        Groups words into lines by y-coordinate, then sorts each line right-to-left."""
        words = page.get_text("words")  # (x0, y0, x1, y1, word, block_no, line_no, word_no)
        if not words:
            return ""

        # Check if page has Arabic content
        all_text = " ".join(w[4] for w in words)
        has_arabic = bool(re.search(r"[\u0600-\u06FF]", all_text))

        if not has_arabic:
            # Non-Arabic page: use default extraction
            return page.get_text("text", sort=True).strip()

        # Group words into lines by y-coordinate (cluster by proximity)
        LINE_TOLERANCE = 5  # pixels — words within this y-range are on the same line
        sorted_words = sorted(words, key=lambda w: (w[1], w[0]))  # sort by y, then x

        lines = []
        current_line = [sorted_words[0]]
        current_y = sorted_words[0][1]

        for w in sorted_words[1:]:
            if abs(w[1] - current_y) <= LINE_TOLERANCE:
                current_line.append(w)
            else:
                lines.append(current_line)
                current_line = [w]
                current_y = w[1]
        lines.append(current_line)

        # Build text: sort each line's words by x-coordinate DESCENDING (RTL)
        result_lines = []
        for line_words in lines:
            # Sort right-to-left (descending x0)
            line_words_sorted = sorted(line_words, key=lambda w: w[0], reverse=True)
            line_text = " ".join(w[4] for w in line_words_sorted)
            result_lines.append(line_text)

        logger.debug("[PYMUPDF p%d] RTL extraction: %d words → %d lines",
                     display_num, len(words), len(result_lines))
        return "\n".join(result_lines)

    def _ocr_page(self, page, page_number: int) -> str | None:
        """Render page to image and run Tesseract OCR with timeout."""
        try:
            import pytesseract
        except ImportError:
            logger.warning("[OCR p%d] pytesseract not installed — skipping", page_number)
            return None

        logger.debug("[OCR p%d] Rendering at %d DPI, langs=%s",
                     page_number, OCR_DPI, OCR_LANGUAGES)
        try:
            with ocr_timeout(self.OCR_PAGE_TIMEOUT):
                mat = fitz.Matrix(OCR_DPI / 72, OCR_DPI / 72)
                pix = page.get_pixmap(matrix=mat)
                img_data = pix.tobytes("png")
                image = Image.open(io.BytesIO(img_data))
                logger.debug("[OCR p%d] Image size: %dx%d", page_number,
                             image.width, image.height)
                text = pytesseract.image_to_string(image, lang=OCR_LANGUAGES)
                logger.debug("[OCR p%d] Tesseract returned %d chars",
                             page_number, len(text) if text else 0)
                return text
        except OcrTimeoutError:
            logger.warning("[OCR p%d] Timeout after %ds", page_number, self.OCR_PAGE_TIMEOUT)
            return None
        except Exception as e:
            logger.warning("[OCR p%d] Failed: %s", page_number, e)
            return None

    def _fix_arabic_text(self, text: str) -> str:
        """
        Fix reversed Arabic text that PyMuPDF sometimes produces.
        PyMuPDF can output Arabic lines in visual (left-to-right) order
        instead of logical (right-to-left) order. This reverses the WORD
        order (not characters) when the line scores better reversed.
        """
        if not re.search(r"[\u0600-\u06FF]", text):
            return text

        lines = text.split("\n")
        fixed = []
        for line in lines:
            stripped = line.strip()
            if not stripped:
                fixed.append("")
                continue

            arabic_chars = re.findall(r"[\u0600-\u06FF]", stripped)
            if len(arabic_chars) < 3:
                fixed.append(stripped)
                continue

            # Reverse WORD order (not characters) to fix bidi
            words = stripped.split()
            reversed_line = " ".join(reversed(words))

            score_original = self._arabic_direction_score(stripped)
            score_reversed = self._arabic_direction_score(reversed_line)

            if score_reversed > score_original:
                fixed.append(reversed_line)
            else:
                fixed.append(stripped)

        return "\n".join(fixed)

    def _arabic_direction_score(self, text: str) -> int:
        """Score how naturally Arabic text reads in this direction.
        Higher score = more likely to be correct logical Arabic order."""
        score = 0
        # Internal word patterns (same in both directions)
        score += len(re.findall(r"(?:^|\s)\u0627\u0644", text)) * 3
        score += len(re.findall(r"(?:^|\s)[\u0648\u0641\u0628\u0644\u0643]\u0627\u0644", text)) * 2
        score += len(re.findall(r"[\u0629\u0649](?:\s|$)", text))
        score += len(re.findall(r"(?:^|\s)(?:\u0645\u0646|\u0641\u064a|\u0639\u0644\u0649|\u0625\u0644\u0649|\u0623\u0646|\u0625\u0646|\u0644\u0627|\u0647\u0630)", text))

        # Position-aware scoring (critical for word-level reversal)
        stripped = text.strip()
        if stripped:
            # Punctuation at END of line = correct Arabic logical order
            if stripped[-1] in '.:\u060C\u061B':
                score += 5
            # Punctuation at START of line = visual LTR order (wrong)
            if stripped[0] in '.:\u060C\u061B':
                score -= 5
            # Common Arabic sentence starters at beginning = correct order
            starters = ['\u064a\u062c\u0628', '\u064a\u062a\u0645', '\u064a\u062c\u0648\u0632', '\u064a\u0643\u0648\u0646',
                        '\u0648\u064a\u062c\u0648\u0632', '\u0648\u064a\u062a\u0645', '\u0648\u0644\u0627', '\u0628\u062d\u064a\u062b',
                        '\u062a\u0642\u062f\u064a\u0645', '\u0625\u062c\u0631\u0627\u0621', '\u0645\u062a\u0627\u0628\u0639\u0629',
                        '\u0627\u0644\u062a\u0623\u0643\u062f', '\u062a\u0639\u0628\u0626\u0629', '\u0625\u0628\u0627\u063a']
            first_word = stripped.split()[0] if stripped.split() else ''
            if first_word in starters:
                score += 4

        return score
