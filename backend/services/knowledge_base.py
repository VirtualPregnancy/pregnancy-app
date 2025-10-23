"""Knowledge Base Service - Manages topics and provides intelligent context"""

import json
from pathlib import Path
from typing import Dict, List, Optional


class KnowledgeBase:
    """Service to manage and query topic knowledge"""
    
    def __init__(self, topics_file: Path):
        self.topics_file = topics_file
        self.topics = {}
        self._load_topics()
        self._build_index()
    
    def _load_topics(self):
        """Load topics from JSON file"""
        if self.topics_file.exists():
            with open(self.topics_file, 'r', encoding='utf-8') as f:
                self.topics = json.load(f)
            print(f"Loaded {len(self.topics)} main topics")
        else:
            print(f"Warning: Topics file not found: {self.topics_file}")
    
    def _build_index(self):
        """Build searchable index of all topics and sub-topics"""
        self.index = []
        
        for topic_key, topic in self.topics.items():
            self.index.append({
                'key': topic_key,
                'url': f'/{topic_key}',
                'title': topic.get('heading', topic.get('title', '')),
                'description': topic.get('content', ''),
                'type': 'main_topic',
                'id': topic.get('id', '')
            })
            
            if 'subTopics' in topic:
                for sub_key, sub_topic in topic['subTopics'].items():
                    self.index.append({
                        'key': f"{topic_key}-{sub_key}",
                        'url': f'/{topic_key}-{sub_key}',
                        'title': sub_topic.get('heading', sub_topic.get('title', '')),
                        'description': '',
                        'type': 'sub_topic',
                        'parent': topic_key,
                        'parent_title': topic.get('title', ''),
                        'id': sub_topic.get('id', '')
                    })
    
    def get_topic_context(self, topic_key: str) -> Optional[Dict]:
        """Get full context for a specific topic"""
        if topic_key in self.topics:
            topic = self.topics[topic_key]
            return {
                'key': topic_key,
                'title': topic.get('heading', topic.get('title', '')),
                'description': topic.get('content', ''),
                'sub_topics': [
                    {
                        'key': f"{topic_key}-{sub_key}",
                        'title': sub.get('heading', sub.get('title', '')),
                        'url': f'/{topic_key}-{sub_key}'
                    }
                    for sub_key, sub in topic.get('subTopics', {}).items()
                ]
            }
        return None
    
    def get_all_topics_summary(self) -> str:
        """Get formatted summary of all topics for AI context"""
        summary = ["Available Topics:\n"]
        
        for topic_key, topic in self.topics.items():
            title = topic.get('heading', topic.get('title', ''))
            content = topic.get('content', '')[:200]
            summary.append(f"**{title}** (/{topic_key})\n   {content}")
            
            if 'subTopics' in topic:
                summary.append("   Sub-topics:")
                for sub_key, sub_topic in topic['subTopics'].items():
                    sub_title = sub_topic.get('heading', sub_topic.get('title', ''))
                    summary.append(f"   - {sub_title} (/{topic_key}-{sub_key})")
            summary.append("")
        
        return "\n".join(summary)
    
    def find_related_topics(self, keywords: List[str]) -> List[Dict]:
        """Find topics related to given keywords"""
        results = []
        keywords_lower = [k.lower() for k in keywords]
        
        for item in self.index:
            score = 0
            text = f"{item['title']} {item['description']}".lower()
            
            for keyword in keywords_lower:
                if keyword in text:
                    score += 1
            
            if score > 0:
                results.append({
                    **item,
                    'relevance_score': score
                })
        
        results.sort(key=lambda x: x['relevance_score'], reverse=True)
        return results[:5]
    
    def get_matching_topics(self, query: str) -> List[Dict]:
        """Find topics matching a query string"""
        keywords = [word.strip() for word in query.lower().split() if len(word.strip()) > 2]
        return self.find_related_topics(keywords) if keywords else []
    
    def get_topic_by_category(self, category: str) -> Optional[Dict]:
        """Get topic information by category name"""
        category_map = {
            'pregnancy': 'pregnancy',
            'complications': 'complications',
            'ultrasound': 'ultrasound',
            'clinical': 'clinical',
            'care': 'clinical',
            'support': 'support',
            'services': 'support'
        }
        
        topic_key = category_map.get(category.lower())
        if topic_key:
            return self.get_topic_context(topic_key)
        return None
    
    def _add_topic_context(self, context: str, topic: Dict) -> str:
        """Add topic information to context string"""
        context += f"## {topic['title']}\n{topic['description']}\n\n"
        context += "Related pages:\n"
        for sub in topic['sub_topics']:
            context += f"- {sub['title']}: {sub['url']}\n"
        return context + "\n"
    
    def create_context_for_ai(self, query: str) -> str:
        """Create intelligent context for AI based on query"""
        query_lower = query.lower()
        context = "# Knowledge Base Context\n\n"
        
        # Topic detection map
        topic_keywords = {
            'pregnancy': ['pregnancy', 'pregnant', 'body', 'placenta', 'fetal', 'baby'],
            'complications': ['complication', 'fgr', 'growth restriction', 'diabetes', 'gdm', 'pre-eclampsia', 'disorder'],
            'ultrasound': ['ultrasound', 'scan', 'doppler', 'imaging'],
            'clinical': ['midwife', 'lmc', 'care', 'doctor', 'clinical', 'pathway'],
            'support': ['support', 'service', 'help', 'mental health', 'counselling']
        }
        
        # Build context from matching topics
        for topic_key, keywords in topic_keywords.items():
            if any(word in query_lower for word in keywords):
                topic = self.get_topic_context(topic_key)
                if topic:
                    context = self._add_topic_context(context, topic)
        
        # Fallback to general summary
        if context == "# Knowledge Base Context\n\n":
            context += self.get_all_topics_summary()
        
        return context

