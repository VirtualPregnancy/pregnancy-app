"""
Action builder for chatbot responses
Generates contextual actions based on user queries and search results
"""
from typing import List, Dict


class ActionBuilder:
    def __init__(self):
        # Common follow-up suggestions for different topics
        self.topic_suggestions = {
            "pregnancy": [
                {"type": "suggestion", "text": "What happens in pregnancy?", "query": "What happens in pregnancy?"},
                {"type": "suggestion", "text": "Tell me about complications", "query": "Tell me about complications"},
                {"type": "suggestion", "text": "Find support services", "query": "Find support services"}
            ],
            "complications": [
                {"type": "suggestion", "text": "Learn about FGR", "query": "reduced fetal growth"},
                {"type": "suggestion", "text": "Understand gestational diabetes", "query": "gestational diabetes"},
                {"type": "suggestion", "text": "Pre-eclampsia information", "query": "pre-eclampsia"}
            ],
            "ultrasound": [
                {"type": "suggestion", "text": "What does my scan mean?", "query": "ultrasound scan meaning"},
                {"type": "suggestion", "text": "Doppler ultrasound", "query": "doppler ultrasound"}
            ],
            "support": [
                {"type": "suggestion", "text": "Find services in Auckland", "query": "services in Auckland"},
                {"type": "suggestion", "text": "Find services in Wellington", "query": "services in Wellington"},
                {"type": "suggestion", "text": "Mental health support", "query": "mental health support"}
            ],
            "care": [
                {"type": "suggestion", "text": "Midwife-led care", "query": "midwife care"},
                {"type": "suggestion", "text": "When care changes", "query": "when care changes"}
            ]
        }
    
    def detect_topic(self, query: str) -> str:
        """Detect main topic from user query"""
        query_lower = query.lower()
        
        # Keywords for each topic
        topic_keywords = {
            "complications": ["fgr", "growth restriction", "diabetes", "gestational diabetes", 
                            "pre-eclampsia", "preeclampsia", "complication"],
            "ultrasound": ["ultrasound", "scan", "doppler", "imaging"],
            "support": ["support", "service", "help", "mental health", "anxiety", 
                       "depression", "auckland", "wellington", "region"],
            "care": ["midwife", "lmc", "care pathway", "doctor", "clinical"],
            "pregnancy": ["pregnancy", "pregnant", "placenta", "fetal", "baby", "body changes"]
        }
        
        for topic, keywords in topic_keywords.items():
            if any(keyword in query_lower for keyword in keywords):
                return topic
        
        return "pregnancy"  # Default
    
    def build_actions(self, query: str, search_results: List[Dict], 
                     max_navigate: int = 3, max_suggest: int = 2) -> List[Dict]:
        """
        Build action list from search results and topic suggestions
        
        Args:
            query: User's query
            search_results: List of relevant pages from vector search
            max_navigate: Maximum number of navigate actions
            max_suggest: Maximum number of suggestion actions
            
        Returns:
            List of action objects
        """
        actions = []
        
        # Add navigate actions from search results (lowered threshold to 0.3)
        navigate_count = 0
        for result in search_results:
            if navigate_count >= max_navigate:
                break
                
            if result["similarity"] > 0.3:  # Lower threshold for more results
                # Use better formatting for navigation text
                nav_text = result['title']
                if len(nav_text) > 50:
                    nav_text = nav_text[:47] + "..."
                
                actions.append({
                    "type": "navigate",
                    "text": nav_text,
                    "path": result["url"],
                    "description": result["description"]
                })
                navigate_count += 1
        
        # Detect topic and add relevant suggestions
        topic = self.detect_topic(query)
        suggestions = self.topic_suggestions.get(topic, self.topic_suggestions["pregnancy"])
        
        # Add suggestions (avoid duplicates with query)
        suggest_count = 0
        for suggestion in suggestions:
            if suggest_count >= max_suggest:
                break
            
            # Don't suggest the same query user just asked
            if suggestion["query"].lower() not in query.lower():
                actions.append(suggestion)
                suggest_count += 1
        
        # If no actions generated, add default ones
        if len(actions) == 0:
            actions.extend([
                {"type": "navigate", "text": "Explore pregnancy topics", 
                 "path": "/pregnancy-changes", "description": "Learn about changes during pregnancy"},
                {"type": "suggestion", "text": "Tell me about complications", 
                 "query": "pregnancy complications"}
            ])
        
        return actions
    
    def build_regional_actions(self, region: str) -> List[Dict]:
        """Build actions for regional service queries"""
        actions = [
            {
                "type": "navigate",
                "text": f"Services in {region}",
                "path": "/support-services",
                "description": f"Find pregnancy support services in {region}"
            },
            {
                "type": "navigate",
                "text": "Specialist services",
                "path": "/support-specialist",
                "description": "Access specialized pregnancy care services"
            },
            {
                "type": "suggestion",
                "text": "Find a midwife",
                "query": "how to find a midwife"
            }
        ]
        return actions

