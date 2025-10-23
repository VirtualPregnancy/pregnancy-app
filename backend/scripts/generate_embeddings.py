"""Script to pre-generate embeddings for all pages"""

import os
import sys
import json
import re
from pathlib import Path
from dotenv import load_dotenv

sys.path.append(str(Path(__file__).parent.parent))

from google import genai
from services.embedding_service import EmbeddingService


def load_page_data(frontend_dir: Path) -> list:
    """Load all page data from pageData files and topics.json"""
    pages_dict = {}
    
    page_data_dir = frontend_dir / "pages" / "_slug" / "pageData" / "json"
    if page_data_dir.exists():
        for json_file in page_data_dir.glob("*.json"):
            if json_file.name == "sample.js":
                continue
                
            try:
                with open(json_file, 'r', encoding='utf-8') as f:
                    page_data = json.load(f)
                
                content_parts = [page_data.get('description', '')] if page_data.get('description') else []
                
                if 'contentSections' in page_data:
                    for section in page_data['contentSections']:
                        if title := section.get('title'):
                            content_parts.append(title)
                        
                        if content := section.get('content'):
                            clean_text = re.sub('<[^<]+?>', ' ', content)
                            clean_text = ' '.join(clean_text.split())
                            content_parts.append(clean_text[:200])
                
                pages_dict[f'/{json_file.stem}'] = {
                    'url': f'/{json_file.stem}',
                    'title': page_data.get('title', ''),
                    'description': ' '.join(content_parts)[:800],
                    'id': page_data.get('id', ''),
                    'source': 'pageData'
                }
            except Exception as e:
                print(f"Error loading {json_file.name}: {e}")
    
    topics_file = frontend_dir / "assets" / "data" / "topics.json"
    if topics_file.exists():
        with open(topics_file, 'r', encoding='utf-8') as f:
            topics = json.load(f)
            
        for topic_key, topic in topics.items():
            url = f'/{topic_key}'
            if url not in pages_dict:
                pages_dict[url] = {
                    'url': url,
                    'title': topic.get('heading', topic.get('title', '')),
                    'description': topic.get('content', ''),
                    'id': topic.get('id', ''),
                    'source': 'topics'
                }
            
            if 'subTopics' in topic:
                for sub_key, sub_topic in topic['subTopics'].items():
                    url = f'/{topic_key}-{sub_key}'
                    if url not in pages_dict:
                        pages_dict[url] = {
                            'url': url,
                            'title': sub_topic.get('heading', sub_topic.get('title', '')),
                            'description': sub_topic.get('content', ''),
                            'id': sub_topic.get('id', ''),
                            'source': 'topics'
                        }
    
    return list(pages_dict.values())


def generate_embeddings(pages: list, embedding_service: EmbeddingService) -> list:
    """Generate embeddings for all pages"""
    print(f"Generating embeddings for {len(pages)} pages...")
    
    for i, page in enumerate(pages):
        text = f"{page['title']}. {page['description']}"
        page['embedding'] = embedding_service.generate_embedding(text)
        
        if (i + 1) % 5 == 0:
            print(f"Processed {i + 1}/{len(pages)} pages")
    
    print("Embeddings generation complete!")
    return pages


def main():
    """Main function to generate and save embeddings"""
    load_dotenv()
    
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("Error: GEMINI_API_KEY not found in environment variables")
        sys.exit(1)
    
    embedding_service = EmbeddingService(genai.Client(api_key=api_key))
    
    backend_dir = Path(__file__).parent.parent
    frontend_dir = backend_dir.parent / "frontend"
    output_file = backend_dir / "data" / "embeddings.json"
    
    print("Loading page data...")
    pages = load_page_data(frontend_dir)
    print(f"Loaded {len(pages)} unique pages")
    print(f"  - From pageData: {sum(1 for p in pages if p.get('source') == 'pageData')}")
    print(f"  - From topics: {sum(1 for p in pages if p.get('source') == 'topics')}")
    
    pages_with_embeddings = generate_embeddings(pages, embedding_service)
    
    output_file.parent.mkdir(exist_ok=True)
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(pages_with_embeddings, f, ensure_ascii=False, indent=2)
    
    print(f"\nEmbeddings saved to: {output_file}")
    print(f"Total pages: {len(pages_with_embeddings)}")
    print(f"File size: {output_file.stat().st_size / 1024:.2f} KB")


if __name__ == "__main__":
    main()

