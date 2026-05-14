# QUAI - Qassim University AI Platform

**QUAI** is a comprehensive Laravel-based AI platform developed for Qassim University. It provides AI-powered educational content generation, custom chatbot agents, meeting transcription, and an OpenAI-compatible API — all powered by locally-hosted Ollama models.

## Features

- **Training Bag Generator**: AI-powered course content generation with interactive quizzes, PPTX export, and shareable links
- **QU Agent**: Create custom chatbots with RAG-based knowledge files (PDF, DOCX, TXT, CSV)
- **Meeting Minutes**: Audio transcription (Whisper API), AI analysis, and DOCX document generation with email distribution
- **Chat API**: OpenAI-compatible endpoints for Ollama models with streaming support
- **Web Search**: SearXNG integration for context-enriched AI responses
- **SAML SSO**: Enterprise authentication with MyQU
- **Admin Panel**: Filament-based dashboard for user, role, and content management
- **Real-time**: WebSocket support via Laravel Reverb
- **Bilingual**: Full Arabic (RTL) and English support

## Requirements

- PHP 8.2+
- Composer
- Node.js & npm
- Ollama (with ALLaM:7b and/or llama3.1:8b models)
- SearXNG (Docker, port 8888)
- SQLite (development) or MySQL/PostgreSQL (production)

## Installation

### 1. Clone and Install Dependencies

```bash
git clone git@gitlab.qu.edu.sa:developers/quai.git
cd quai
composer install
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
php artisan key:generate
```

Edit `.env` and configure:

```env
APP_NAME=QUAI
APP_URL=https://your-domain.com

# Ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=iKhalid/ALLaM:7b
OLLAMA_TIMEOUT=120

# SearXNG Web Search
SEARXNG_BASE_URL=http://localhost:8888

# Whisper (for meeting transcription)
WHISPER_API_KEY=your-key

# SAML SSO
SAML_SP_ENTITY_ID=your-sp-id
SAML_SP_ACS_URL=https://your-domain.com/saml/acs
SAML_IDP_ENTITY_ID=idp-entity-id
SAML_IDP_LOGIN_URL=https://idp.example.com/login
SAML_IDP_CERT=base64-cert

# API Security
QUAI_ALLOWED_IPS=127.0.0.1,::1
```

### 3. Database & Build

```bash
php artisan migrate
npm run build
```

### 4. Setup Ollama

```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull required models
ollama pull iKhalid/ALLaM:7b    # Arabic model
ollama pull llama3.1:8b          # English model
```

### 5. Setup SearXNG (Docker)

```bash
docker run -d --name searxng -p 8888:8080 searxng/searxng
```

## Running the Project

### Development

```bash
# Run all services concurrently (server, queue, logs, vite)
composer dev
```

This starts:
- Laravel server on port 8007
- Queue worker
- Log viewer (Pail)
- Vite dev server

Or run individually:

```bash
php artisan serve --port=8007
php artisan queue:listen --tries=1
npm run dev
```

### Production

```bash
composer install --optimize-autoloader --no-dev
npm run build
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize
```

## Project Structure

```
quai/
├── app/
│   ├── Http/Controllers/
│   │   ├── Api/
│   │   │   ├── ChatController.php           # OpenAI-compatible chat API
│   │   │   ├── TrainingBagController.php     # Training content generation
│   │   │   ├── CludeAgentController.php      # Custom AI agents CRUD & chat
│   │   │   ├── MeetingMinutesController.php  # Meeting transcription & docs
│   │   │   └── VoiceCallController.php       # WebRTC voice calls
│   │   └── Auth/
│   │       └── SamlController.php            # SAML SSO authentication
│   ├── Models/
│   │   ├── User.php
│   │   ├── TrainingBag.php
│   │   ├── CludeAgent.php
│   │   ├── MeetingMinute.php
│   │   └── ...
│   ├── Services/
│   │   ├── OllamaService.php                # Ollama API integration
│   │   ├── WebSearchService.php              # SearXNG search
│   │   ├── CludeAgentService.php             # Agent chat & RAG
│   │   ├── TrainingBagPresentationService.php # PPTX generation
│   │   ├── TranscriptionService.php          # Whisper transcription
│   │   └── MeetingMinutesService.php         # DOCX generation
│   └── Filament/                             # Admin panel resources
├── config/
│   └── quai.php                              # Platform configuration
├── resources/views/
│   ├── home/                                 # Dashboard
│   ├── training/show.blade.php               # Training bag viewer
│   ├── agent/chat.blade.php                  # Agent chat interface
│   └── layouts/app.blade.php                 # Main layout
└── routes/
    ├── web.php                               # Web routes + SAML
    └── api.php                               # API endpoints
```

## API Endpoints

### Chat API (`/api/v1`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/chat/completions` | Chat completion (OpenAI-compatible) |
| POST | `/completions` | Text completion |
| GET | `/models` | List available models |
| GET | `/web-search/status` | Web search availability |

### Training Bags (`/api`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/training-bag/generate` | Generate training content |
| POST | `/training-bag/save` | Save to database |
| PUT | `/training-bag/{id}/update` | Update content |
| POST | `/training-bag/download-pptx` | Export as PowerPoint |

### QU Agents (`/api/v1`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/clude-agents` | List / Create agents |
| GET/PUT/DELETE | `/clude-agents/{id}` | Agent CRUD |
| POST | `/agent-chat/{token}/chat` | Chat with agent |
| POST | `/agent-chat/{token}/chat-stream` | Stream chat |

### Meeting Minutes (`/api/v1`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/meeting-minutes/upload` | Upload audio |
| POST | `/meeting-minutes/{id}/transcribe` | Transcribe audio |
| POST | `/meeting-minutes/{id}/analyze` | AI analysis |
| POST | `/meeting-minutes/{id}/generate` | Generate DOCX |

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | System health check |

## Admin Panel

Access the Filament admin panel at `/admin` to manage:
- Users and SAML attributes
- Roles and permissions
- Training bags
- QU Agents
- Audit logs

## Testing

```bash
# Run all tests
composer test

# Or directly
php artisan test

# Specific test suite
php artisan test --testsuite=Feature
```

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| Laravel 12 | Web framework |
| Filament 3 | Admin panel |
| Ollama | Local LLM inference (ALLaM:7b, llama3.1:8b) |
| SearXNG | Private web search engine |
| Spatie Permission | Role-based access control |
| OneLogin SAML | SSO authentication |
| Laravel Reverb | WebSocket server |
| PhpPresentation | PPTX export |
| PhpWord | DOCX generation |
| Tailwind CSS 4 | Styling |
| Vite 7 | Asset bundling |

## License

Proprietary - Qassim University
