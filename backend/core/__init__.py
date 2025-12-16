"""Core configuration and dependencies"""

from .config import config
from .dependencies import get_ai_client, get_embedding_service, get_vector_search, get_knowledge_base

__all__ = ['config', 'get_ai_client', 'get_embedding_service', 'get_vector_search', 'get_knowledge_base']

