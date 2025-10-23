"""
Vector search module for pregnancy app pages
Uses embeddings to find most relevant pages based on user queries
"""
import os
import json
import re
from pathlib import Path
from typing import List, Dict, Tuple
import numpy as np
from google import genai


class PageVectorSearch:
    def __init__(self, client: genai.Client):
        self.client = client
        self.pages_data = []
        self.embeddings_cache = {}
    
    @staticmethod
    def clean_html(text: str) -> str:
        """Remove HTML tags and clean text"""
        if not text:
            return ""
        # Remove HTML tags
        text = re.sub(r'<[^>]+>', ' ', text)
        # Remove multiple spaces
        text = re.sub(r'\s+', ' ', text)
        # Remove <br /> artifacts
        text = text.replace('< br / >', '\n')
        return text.strip()
        
    def load_page_data(self, frontend_dir: Path) -> None:
        """Load all page data from JSON files and topics.json"""
        
        # Load topics.json for URL mapping
        topics_path = frontend_dir / "assets" / "data" / "topics.json"
        with open(topics_path, "r", encoding="utf-8") as f:
            topics = json.load(f)
        
        # Load additional data files for extra context
        additional_data = {}
        data_dir = frontend_dir / "assets" / "data"
        
        try:
            with open(data_dir / "chatbotConfig.json", "r", encoding="utf-8") as f:
                additional_data["chatbot"] = json.load(f)
            with open(data_dir / "supportData.json", "r", encoding="utf-8") as f:
                additional_data["support"] = json.load(f)
        except Exception:
            pass
        
        # Create URL mapping from topics
        url_mapping = self._create_url_mapping(topics)
        
        # Load all page JSON files
        page_data_dir = frontend_dir / "pages" / "_slug" / "pageData" / "json"
        
        for json_file in page_data_dir.glob("*.json"):
            if json_file.stem == "sample":
                continue
                
            try:
                with open(json_file, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    
                # Extract title and description
                title = data.get("title", "")
                description = data.get("description", "")
                page_id = data.get("id", "")
                
                # Generate URL from filename and mapping
                url = self._generate_url(json_file.stem, page_id, url_mapping)
                
                # Combine title and description for embedding
                combined_text = f"{title}. {description}"
                
                # Extract content from sections for better matching
                content_sections = data.get("contentSections", [])
                section_texts = []
                for section in content_sections:  # Use all sections
                    section_title = section.get("title", "")
                    section_content = section.get("content", "")
                    
                    if section_title:
                        section_texts.append(section_title)
                    
                    # Add first 200 chars of content for better context
                    if section_content:
                        clean_content = self.clean_html(section_content)[:200]
                        section_texts.append(clean_content)
                
                if section_texts:
                    combined_text += " " + " ".join(section_texts)
                
                # Add keywords from filename for better matching
                filename_keywords = json_file.stem.replace("-", " ").replace("_", " ")
                combined_text += f" {filename_keywords}"
                
                # Store full content for context
                full_content = []
                has_content = False
                
                for section in content_sections:
                    section_title = section.get("title", "")
                    section_content = section.get("content", "")
                    
                    if section_content:
                        # Clean HTML from content
                        cleaned_content = self.clean_html(section_content)
                        full_content.append(f"### {section_title}\n{cleaned_content}")
                        has_content = True
                
                # If no content sections, try to get info from chatbotConfig
                if not has_content:
                    # Try to find relevant info from chatbotConfig
                    chatbot_info = self._get_chatbot_info(title, additional_data.get("chatbot", {}))
                    if chatbot_info:
                        full_content.append(chatbot_info)
                    elif description:
                        full_content.append(description)
                    
                    # Also add section titles for context
                    section_titles = [s.get("title", "") for s in content_sections if s.get("title")]
                    if section_titles:
                        full_content.append(f"\nTopics covered: {', '.join(section_titles)}")
                
                self.pages_data.append({
                    "title": title,
                    "description": description,
                    "url": url,
                    "text": combined_text,
                    "full_content": "\n\n".join(full_content) if full_content else description,
                    "id": page_id,
                    "filename": json_file.stem
                })
                
            except Exception:
                pass
    
    def _get_chatbot_info(self, page_title: str, chatbot_config: Dict) -> str:
        """Extract relevant information from chatbotConfig.json"""
        if not chatbot_config or "intents" not in chatbot_config:
            return ""
        
        info_parts = []
        
        # Search through intents for matching information
        for intent_name, intent_data in chatbot_config["intents"].items():
            response = intent_data.get("response", {})
            
            # Check if title matches or is related
            message = response.get("message", "")
            summary = response.get("summary", {})
            
            # Look for keywords in title
            title_lower = page_title.lower()
            keywords_map = {
                "support": ["support", "service"],
                "ultrasound": ["ultrasound", "scan", "doppler"],
                "fetal": ["fetal", "development", "baby"],
                "diabetes": ["diabetes", "gdm", "gestational"],
                "growth": ["growth", "fgr", "restriction"]
            }
            
            for key, keywords in keywords_map.items():
                if any(kw in title_lower for kw in keywords):
                    if key in intent_name or any(kw in intent_name for kw in keywords):
                        if message:
                            info_parts.append(message)
                        for summary_key, summary_text in summary.items():
                            if summary_text:
                                info_parts.append(f"{summary_key.title()}: {summary_text}")
        
        return "\n\n".join(info_parts[:3]) if info_parts else ""  # Limit to first 3 matches
    
    def _create_url_mapping(self, topics: Dict) -> Dict:
        """Create mapping from page IDs to URL paths"""
        url_mapping = {}
        
        for topic_key, topic_data in topics.items():
            if "subTopics" in topic_data:
                for subtopic_key, subtopic_data in topic_data["subTopics"].items():
                    page_id = subtopic_data.get("id", "")
                    if page_id:
                        url = f"/{topic_key}-{subtopic_key}"
                        url_mapping[page_id] = url
        
        return url_mapping
    
    def _generate_url(self, filename: str, page_id: str, url_mapping: Dict) -> str:
        """Generate URL from filename or page ID"""
        if page_id in url_mapping:
            return url_mapping[page_id]
        
        # Fallback: use filename
        return f"/{filename}"
    
    def _get_embedding(self, text: str) -> np.ndarray:
        """Get embedding vector for text using Gemini API"""
        # Check cache first
        if text in self.embeddings_cache:
            return self.embeddings_cache[text]
        
        try:
            result = self.client.models.embed_content(
                model="models/text-embedding-004",
                contents=text
            )
            
            embedding = np.array(result.embeddings[0].values)
            self.embeddings_cache[text] = embedding
            return embedding
            
        except Exception:
            # Return zero vector as fallback
            return np.zeros(768)
    
    def _cosine_similarity(self, vec1: np.ndarray, vec2: np.ndarray) -> float:
        """Calculate cosine similarity between two vectors"""
        dot_product = np.dot(vec1, vec2)
        norm1 = np.linalg.norm(vec1)
        norm2 = np.linalg.norm(vec2)
        
        if norm1 == 0 or norm2 == 0:
            return 0.0
        
        return dot_product / (norm1 * norm2)
    
    def generate_all_embeddings(self) -> None:
        """Pre-generate embeddings for all pages"""
        for page in self.pages_data:
            embedding = self._get_embedding(page["text"])
            page["embedding"] = embedding
    
    def _keyword_boost(self, query: str, page_text: str) -> float:
        """Calculate keyword match boost score"""
        query_lower = query.lower()
        page_lower = page_text.lower()
        
        # Important keywords that should boost similarity
        keyword_map = {
            "fgr": ["fgr", "fetal growth restriction", "growth restriction", "reduced growth"],
            "diabetes": ["diabetes", "gdm", "gestational diabetes", "blood sugar"],
            "preeclampsia": ["preeclampsia", "pre-eclampsia", "pe", "blood pressure"],
            "ultrasound": ["ultrasound", "scan", "doppler", "imaging"],
            "placenta": ["placenta", "placental"],
            "support": ["support", "service", "help"],
            "midwife": ["midwife", "lmc", "lead maternity carer"],
            "baby": ["baby", "fetal", "fetus", "pepi"]
        }
        
        boost = 0.0
        for key, keywords in keyword_map.items():
            if any(kw in query_lower for kw in keywords):
                if any(kw in page_lower for kw in keywords):
                    boost += 0.1  # Add small boost
        
        return min(boost, 0.3)  # Cap at 0.3
    
    def search(self, query: str, top_k: int = 5, min_similarity: float = 0.2) -> List[Dict]:
        """
        Search for most relevant pages based on query
        
        Args:
            query: User's question/query
            top_k: Number of top results to return
            min_similarity: Minimum similarity threshold
            
        Returns:
            List of dictionaries with page info and similarity scores
        """
        # Get query embedding
        query_embedding = self._get_embedding(query)
        
        # Calculate similarities
        results = []
        for page in self.pages_data:
            if "embedding" not in page:
                page["embedding"] = self._get_embedding(page["text"])
            
            similarity = self._cosine_similarity(query_embedding, page["embedding"])
            
            # Add keyword boost
            keyword_boost = self._keyword_boost(query, page["text"])
            final_similarity = min(similarity + keyword_boost, 1.0)
            
            # Only include pages above minimum similarity
            if final_similarity >= min_similarity:
                results.append({
                    "title": page["title"],
                    "description": page["description"],
                    "url": page["url"],
                    "similarity": float(final_similarity),
                    "id": page["id"]
                })
        
        # Sort by similarity (descending)
        results.sort(key=lambda x: x["similarity"], reverse=True)
        
        # Return top K results
        return results[:top_k]
    
    def get_context_for_query(self, query: str, top_k: int = 3) -> str:
        """
        Get relevant page content as context for answering query
        
        Args:
            query: User's question
            top_k: Number of pages to include in context
            
        Returns:
            Formatted context string with relevant page information
        """
        results = self.search(query, top_k)
        
        context = "Relevant pages:\n\n"
        for i, result in enumerate(results, 1):
            context += f"{i}. {result['title']}\n"
            context += f"   URL: {result['url']}\n"
            context += f"   {result['description']}\n"
            context += f"   Relevance: {result['similarity']:.2f}\n\n"
        
        return context
    
    def get_detailed_context_for_ai(self, query: str, top_k: int = 2) -> str:
        """
        Get detailed page content for AI to use as knowledge base
        
        Args:
            query: User's question
            top_k: Number of pages to include (fewer due to content length)
            
        Returns:
            Detailed context with full page content
        """
        # Get query embedding
        query_embedding = self._get_embedding(query)
        
        # Calculate similarities and get full content
        results_with_content = []
        for page in self.pages_data:
            if "embedding" not in page:
                page["embedding"] = self._get_embedding(page["text"])
            
            similarity = self._cosine_similarity(query_embedding, page["embedding"])
            
            # Add keyword boost for better matching
            keyword_boost = self._keyword_boost(query, page["text"])
            final_similarity = min(similarity + keyword_boost, 1.0)
            
            # Lower threshold to include more potentially relevant pages
            if final_similarity > 0.25:
                results_with_content.append({
                    "title": page["title"],
                    "description": page["description"],
                    "url": page["url"],
                    "full_content": page.get("full_content", ""),
                    "similarity": float(final_similarity)
                })
        
        # Sort by similarity
        results_with_content.sort(key=lambda x: x["similarity"], reverse=True)
        
        # Build detailed context
        context = "# Knowledge Base - Relevant Information from Pregnancy App\n\n"
        context += "Use the following information to answer the user's question accurately:\n\n"
        
        for i, result in enumerate(results_with_content[:top_k], 1):
            context += f"## {i}. {result['title']}\n"
            context += f"**Page URL**: {result['url']}\n"
            context += f"**Description**: {result['description']}\n\n"
            
            if result['full_content']:
                # Strip HTML tags for cleaner content
                content = result['full_content']
                context += f"**Content**:\n{content}\n\n"
            else:
                # Fallback to description if no full content
                context += f"**Content**: {result['description']}\n\n"
            
            context += "---\n\n"
        
        return context

