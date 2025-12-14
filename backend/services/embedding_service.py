"""Embedding Service - Generate embeddings using Google Gemini API"""

from google import genai
from typing import List
import numpy as np


class EmbeddingService:
    """Service for generating text embeddings"""
    
    def __init__(self, client: genai.Client):
        self.client = client
        self.model = "models/text-embedding-004"
    
    def generate_embedding(self, text: str) -> List[float]:
        """Generate embedding for a single text"""
        try:
            response = self.client.models.embed_content(model=self.model, contents=text)
            return response.embeddings[0].values
        except Exception as e:
            print(f"Error generating embedding: {e}")
            return []
    
    def generate_embeddings_batch(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for multiple texts"""
        return [self.generate_embedding(text) for text in texts]
    
    @staticmethod
    def cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
        """Calculate cosine similarity between two vectors"""
        if not vec1 or not vec2:
            return 0.0
        
        v1, v2 = np.array(vec1), np.array(vec2)
        norm_product = np.linalg.norm(v1) * np.linalg.norm(v2)
        
        return float(np.dot(v1, v2) / norm_product) if norm_product != 0 else 0.0

