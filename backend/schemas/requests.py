"""Request models for API endpoints"""

from typing import Optional, List
from pydantic import BaseModel


class ChatMessage(BaseModel):
    """Single chat message"""
    role: str  # 'user' or 'assistant'
    content: str


class ChatRequest(BaseModel):
    """Request model for chat endpoint"""
    message: str
    history: Optional[List[ChatMessage]] = None  # Optional conversation history

