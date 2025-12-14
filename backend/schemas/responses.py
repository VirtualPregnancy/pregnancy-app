"""Response models for API endpoints"""

from typing import List, Literal
from pydantic import BaseModel


class NavigateAction(BaseModel):
    """Navigate action - for page jump"""
    type: Literal["navigate"] = "navigate"
    text: str
    path: str
    description: str


class SuggestionAction(BaseModel):
    """Suggestion action - for follow-up questions"""
    type: Literal["suggestion"] = "suggestion"
    text: str
    query: str


class ChatResponse(BaseModel):
    """Response from chat endpoint"""
    response: str
    actions: List[NavigateAction | SuggestionAction]

