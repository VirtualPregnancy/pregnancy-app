"""Request models for API endpoints"""

from pydantic import BaseModel


class ChatRequest(BaseModel):
    """Request model for chat endpoint"""
    message: str

