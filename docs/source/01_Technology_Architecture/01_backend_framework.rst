Backend Framework
=================

Overview
--------

The backend is built with **FastAPI**, providing a RESTful API for the AI-powered pregnancy health assistant. It integrates with Google Gemini AI for natural language processing and intelligent responses.

Technology Stack
----------------

- **Framework**: FastAPI (Python web framework)
- **AI Service**: Google Gemini 2.0 Flash Lite
- **Embedding Model**: Google Gemini text-embedding-004
- **Server**: Uvicorn (ASGI server)
- **Data Processing**: NumPy (for vector similarity calculations)

Project Structure
-----------------

::

   backend/
   ├── main.py                 # Application entry point
   ├── api/                    # API routes
   │   ├── __init__.py        # Router aggregation
   │   └── chat.py            # Chat endpoint
   ├── core/                   # Core configuration and dependencies
   │   ├── config.py          # Application configuration
   │   └── dependencies.py    # Dependency injection
   ├── services/               # Business logic services
   │   ├── embedding_service.py    # Text embedding generation
   │   ├── vector_search.py       # Vector similarity search
   │   └── knowledge_base.py      # Knowledge base management
   ├── schemas/                 # Pydantic models
   │   ├── requests.py         # Request models
   │   └── responses.py        # Response models
   ├── data/                    # Data storage
   │   └── embeddings.json     # Pre-generated page embeddings
   ├── scripts/                 # Utility scripts
   │   └── generate_embeddings.py  # Embedding generation script
   └── static/                  # Static files
       └── images/             # Image assets

File Descriptions
-----------------

**main.py**
   Application entry point that initializes FastAPI, configures CORS middleware, mounts static files, and registers API routes. Provides health check endpoint.

**api/chat.py**
   Main chat API endpoint that processes user messages, retrieves relevant context from knowledge base and vector search, generates AI responses using Gemini, and returns structured responses with navigation actions and suggestions.

**core/config.py**
   Centralized configuration management including:
   - Gemini API credentials and model settings
   - CORS configuration
   - File paths for embeddings and topics
   - System context prompt for AI assistant

**core/dependencies.py**
   Dependency injection using FastAPI's dependency system with singleton pattern:
   - AI client initialization
   - Service instances (embedding, vector search, knowledge base)
   - Ensures single instance per service for efficiency

**services/embedding_service.py**
   Generates text embeddings using Google Gemini embedding API. Provides methods for single and batch embedding generation, and cosine similarity calculation for vector comparison.

**services/vector_search.py**
   Vector-based semantic search service that:
   - Loads pre-generated page embeddings
   - Generates query embeddings
   - Performs cosine similarity search
   - Returns top-k most relevant pages

**services/knowledge_base.py**
   Manages topic knowledge from topics.json:
   - Loads and indexes all topics and sub-topics
   - Provides topic context for AI prompts
   - Finds related topics based on keywords
   - Creates intelligent context based on user queries

**schemas/requests.py**
   Pydantic models for API requests:
   - ``ChatRequest``: User message with optional conversation history
   - ``ChatMessage``: Individual message in conversation history

**schemas/responses.py**
   Pydantic models for API responses:
   - ``ChatResponse``: Main response with text and actions
   - ``NavigateAction``: Page navigation action
   - ``SuggestionAction``: Follow-up question suggestion

**scripts/generate_embeddings.py**
   Utility script to pre-generate embeddings for all pages:
   - Loads page data from frontend pageData and topics.json
   - Generates embeddings using Gemini API
   - Saves embeddings to data/embeddings.json for fast retrieval

Data Flow Architecture
----------------------

Request Flow
~~~~~~~~~~~~

::

   Client Request
        │
        ▼
   ┌─────────────────┐
   │  FastAPI Router │
   │  (api/chat.py)  │
   └────────┬────────┘
            │
            ├──────────────────┬──────────────────┐
            ▼                  ▼                  ▼
   ┌─────────────────┐ ┌──────────────┐ ┌──────────────────┐
   │ Knowledge Base  │ │ Vector Search│ │  AI Client       │
   │   Service       │ │   Service    │ │  (Gemini)        │
   └────────┬────────┘ └──────┬───────┘ └────────┬─────────┘
            │                  │                   │
            │                  │                   │
            ▼                  ▼                   ▼
   ┌─────────────────┐ ┌──────────────┐ ┌──────────────────┐
   │ topics.json     │ │ embeddings   │ │  Generate        │
   │ (Topic Context) │ │ .json        │ │  Response        │
   └─────────────────┘ └──────────────┘ └────────┬─────────┘
                                                   │
                                                   ▼
                                            ┌──────────────┐
                                            │ ChatResponse  │
                                            │ + Actions     │
                                            └──────┬───────┘
                                                   │
                                                   ▼
                                            Client Response

Detailed Process Flow
~~~~~~~~~~~~~~~~~~~~~

1. **User sends message** → ``ChatRequest`` with message and optional history

2. **Knowledge Base Service** creates context:
   - Analyzes query keywords
   - Matches relevant topics from topics.json
   - Builds formatted context string for AI

3. **Vector Search Service** finds relevant pages:
   - Generates embedding for user query
   - Compares with pre-generated page embeddings
   - Returns top 5 most similar pages

4. **AI Prompt Construction**:
   - System context (role and guidelines)
   - Knowledge base context (relevant topics)
   - Conversation history (last 5 messages)
   - User question

5. **Gemini API Call**:
   - Generates natural language response
   - Uses exponential backoff retry on failures
   - Falls back to keyword-based suggestions if AI unavailable

6. **AI Suggestions Generation**:
   - Generates 2-3 follow-up questions
   - Uses same language as user query
   - Creates suggestion actions

7. **Response Assembly**:
   - Combines AI response text
   - Adds navigation actions (from vector search)
   - Adds suggestion actions (from AI)
   - Returns ``ChatResponse``



API Endpoints
-------------

**POST /chat**
   Main chat endpoint for user interactions.

   **Request Body**:
   
   .. code-block:: json

      {
        "message": "What is gestational diabetes?",
        "history": [
          {
            "role": "user",
            "content": "Hello"
          },
          {
            "role": "assistant",
            "content": "Hello! How can I help you?"
          }
        ]
      }

   **Response**:
   
   .. code-block:: json

      {
        "response": "Gestational diabetes is...",
        "actions": [
          {
            "type": "navigate",
            "text": "Gestational Diabetes",
            "path": "/complications-gdm",
            "description": "Learn more about GDM..."
          },
          {
            "type": "suggestion",
            "text": "How to manage GDM?",
            "query": "How can I manage gestational diabetes?"
          }
        ]
      }

**GET /**
   Health check endpoint returning API status and statistics.

   **Response**:
   
   .. code-block:: json

      {
        "status": "ok",
        "message": "Pregnancy AI Assistant",
        "indexed_pages": 45,
        "topics": 5
      }

Configuration
-------------

Environment Variables
~~~~~~~~~~~~~~~~~~~~~

- ``GEMINI_API_KEY``: Google Gemini API key (required)

Configuration File
~~~~~~~~~~~~~~~~~~

All configuration is managed in ``core/config.py``:

- **AI Model**: ``gemini-2.0-flash-lite``
- **Embedding Model**: ``models/text-embedding-004``
- **Retry Settings**: 3 attempts with exponential backoff
- **CORS**: Configured for cross-origin requests

Deployment
----------

The backend can be deployed using:

- **Vercel**: Configured via ``vercel.json``
- **Uvicorn**: Direct ASGI server deployment
- **Docker**: Containerized deployment (if configured)

Requirements
~~~~~~~~~~~~

All dependencies are listed in ``requirements.txt``:

- fastapi
- uvicorn[standard]
- google-genai
- python-dotenv
- numpy
- pydantic

