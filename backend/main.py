"""Main application entry point"""

from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from core import config, get_vector_search, get_knowledge_base
from api import api_router

app = FastAPI(
    title="Pregnancy AI Assistant API",
    description="AI-powered assistant for pregnancy health information in Aotearoa New Zealand",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=config.CORS_ORIGINS,
    allow_credentials=config.CORS_CREDENTIALS,
    allow_methods=config.CORS_METHODS,
    allow_headers=config.CORS_HEADERS,
)

app.include_router(api_router)

# Mount static files directory for images
static_dir = Path(__file__).parent / "static"
static_dir.mkdir(exist_ok=True)
app.mount("/static", StaticFiles(directory=str(static_dir)), name="static")


@app.get("/")
async def root():
    """Root endpoint - API health check"""
    vector_search = get_vector_search()
    knowledge_base = get_knowledge_base()
    
    return {
        "status": "ok",
        "message": "Pregnancy AI Assistant",
        "indexed_pages": vector_search.get_page_count(),
        "topics": len(knowledge_base.topics)
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
