"""Vector Search Service - Search for similar pages using embeddings"""

import json
from pathlib import Path
from typing import List, Dict
from .embedding_service import EmbeddingService


class VectorSearchService:
    """Service for vector-based page search"""
    
    def __init__(self, embedding_service: EmbeddingService, embeddings_file: Path):
        self.embedding_service = embedding_service
        self.embeddings_file = embeddings_file
        self.pages_data = []
        self._load_embeddings()
    
    def _load_embeddings(self):
        """Load pre-generated embeddings from file"""
        if self.embeddings_file.exists():
            with open(self.embeddings_file, 'r', encoding='utf-8') as f:
                self.pages_data = json.load(f)
            print(f"Loaded {len(self.pages_data)} page embeddings")
        else:
            print(f"Warning: Embeddings file not found: {self.embeddings_file}")
            self.pages_data = []
    
    def search(self, query: str, top_k: int = 5) -> List[Dict]:
        """Search for most relevant pages based on query"""
        if not self.pages_data:
            return []
        
        query_embedding = self.embedding_service.generate_embedding(query)
        if not query_embedding:
            return []
        
        results = [
            {
                'url': page['url'],
                'title': page['title'],
                'description': page['description'],
                'similarity': self.embedding_service.cosine_similarity(
                    query_embedding, page.get('embedding', [])
                )
            }
            for page in self.pages_data
        ]
        
        results.sort(key=lambda x: x['similarity'], reverse=True)
        return results[:top_k]
    
    def get_page_count(self) -> int:
        """Get number of indexed pages"""
        return len(self.pages_data)

