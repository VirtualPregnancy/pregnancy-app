"""Shared dependencies for API endpoints"""

from functools import lru_cache
from google import genai
from .config import config
from services import EmbeddingService, VectorSearchService, KnowledgeBase


@lru_cache()
def get_ai_client():
    """Get singleton AI client instance"""
    return genai.Client(api_key=config.GEMINI_API_KEY)


@lru_cache()
def get_embedding_service():
    """Get singleton embedding service instance"""
    return EmbeddingService(get_ai_client())


@lru_cache()
def get_vector_search():
    """Get singleton vector search service instance"""
    return VectorSearchService(get_embedding_service(), config.EMBEDDINGS_FILE)


@lru_cache()
def get_knowledge_base():
    """Get singleton knowledge base instance"""
    return KnowledgeBase(config.TOPICS_FILE)

