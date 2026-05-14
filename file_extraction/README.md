# QUAI File Extraction Service

Arabic-supported file text extraction microservice for the QUAI platform. Extracts text from uploaded files with full Arabic/RTL language support, including OCR for scanned PDFs.

## Supported File Types

| Type | Extension | Method |
|------|-----------|--------|
| PDF (text) | `.pdf` | PyMuPDF direct extraction |
| PDF (scanned) | `.pdf` | PyMuPDF + Tesseract OCR (auto-detected) |
| Word | `.docx`, `.doc` | python-docx |
| PowerPoint | `.pptx` | python-pptx |
| Plain text | `.txt`, `.md`, `.csv`, `.json` | Direct read |

## API Endpoints

### `POST /extract`
Upload a file and extract its text content.

**Response:**
```json
{
  "filename": "document.pdf",
  "file_type": "pdf",
  "content": "extracted text...",
  "chunks": ["chunk1...", "chunk2..."],
  "char_count": 12345,
  "page_count": 5,
  "ocr_applied": true,
  "truncated": false,
  "language_detected": "ar"
}
```

### `GET /health`
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "tesseract_available": true,
  "tesseract_languages": ["ara", "eng"]
}
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `EXTRACT_MAX_CHUNK_SIZE` | `4000` | Max characters per chunk |
| `EXTRACT_MAX_FILE_SIZE_MB` | `20` | Max upload file size in MB |
| `EXTRACT_OCR_LANGUAGES` | `ara+eng` | Tesseract language string |
| `EXTRACT_OCR_DPI` | `300` | DPI for rendering scanned pages |
| `EXTRACT_SCANNED_THRESHOLD` | `50` | Min chars before page is considered scanned |
| `EXTRACT_LOG_LEVEL` | `INFO` | Python log level |

## Run Locally

```bash
cd file_extraction

# Install dependencies
pip install -r requirements.txt

# Install tesseract (macOS)
brew install tesseract tesseract-lang

# Run development server
uvicorn main:app --reload --port 8000
```

## Run with Docker

```bash
# From project root
docker compose up --build file-extraction

# Or standalone
cd file_extraction
docker build -t quai-file-extraction .
docker run -p 8000:8000 quai-file-extraction
```

## Example curl Commands

```bash
# Extract text from a PDF
curl -X POST http://localhost:8000/extract \
  -F "file=@document.pdf"

# Extract from a Word document
curl -X POST http://localhost:8000/extract \
  -F "file=@report.docx"

# Extract from a PowerPoint
curl -X POST http://localhost:8000/extract \
  -F "file=@presentation.pptx"

# Health check
curl http://localhost:8000/health
```

## Laravel Integration

The QUAI Laravel app uses `FileExtractionApiService` to call this microservice:

```php
// config/quai.php
'file_extraction' => [
    'base_url' => env('FILE_EXTRACTION_BASE_URL', 'http://localhost:8000'),
    'timeout' => env('FILE_EXTRACTION_TIMEOUT', 60),
    'fallback_enabled' => env('FILE_EXTRACTION_FALLBACK', true),
],
```

```php
// Using the service
$service = app(FileExtractionApiService::class);
$result = $service->extractText('/path/to/file.pdf', 'file.pdf');
echo $result['content'];     // extracted text
echo $result['ocr_applied']; // true if OCR was used
```

```php
// Laravel Http::attach example
use Illuminate\Support\Facades\Http;

$response = Http::timeout(60)
    ->attach('file', fopen($filePath, 'r'), $filename)
    ->post('http://localhost:8000/extract');

$data = $response->json();
// $data['content'], $data['chunks'], $data['ocr_applied'], etc.
```

If the Python service is unavailable, the Laravel app automatically falls back to the PHP-based `FileExtractionService` (no OCR, no PPTX support).
