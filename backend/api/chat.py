"""Chat API endpoints"""

import asyncio
import json
import re
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from google import genai
from google.genai.errors import ServerError, ClientError
from schemas import ChatRequest, ChatResponse, NavigateAction, SuggestionAction
from core import config, get_ai_client, get_vector_search, get_knowledge_base
from services import VectorSearchService, KnowledgeBase

router = APIRouter()


async def generate_with_retry(client: genai.Client, prompt: str, max_retries: int = 3) -> str:
    """Generate AI response with exponential backoff retry"""
    for attempt in range(max_retries):
        try:
            response = client.models.generate_content(
                model=config.GEMINI_MODEL,
                contents=prompt,
            )
            return response.text
        except ServerError as e:
            if attempt < max_retries - 1:
                wait_time = config.GEMINI_RETRY_DELAY * (2 ** attempt)
                await asyncio.sleep(wait_time)
            else:
                raise e
    
    raise ServerError(503, {"error": "Max retries exceeded"}, None)


def create_fallback_response(message: str, knowledge_base: KnowledgeBase) -> str:
    """Create fallback response when AI is unavailable"""
    topics_info = knowledge_base.get_matching_topics(message.lower())
    
    if topics_info:
        topic_names = [t['title'] for t in topics_info[:3]]
        return f"I apologize, but the AI service is currently experiencing high demand. However, I can suggest relevant topics for your question: {', '.join(topic_names)}. Please check the following page(s) might help:"
    
    return "I apologize, but the AI service is currently experiencing high demand. Please try again in a moment, or browse the following page(s) might help:"


def create_actions_from_pages(relevant_pages: list) -> List[NavigateAction | SuggestionAction]:
    """Create navigate actions from relevant pages"""
    return [
        NavigateAction(
            type="navigate",
            text=page.get('title', 'Learn More'),
            path=page.get('url', ''),
            description=page.get('description', '')[:100]
        )
        for page in relevant_pages[:3]
    ]


async def generate_ai_suggestions(client: genai.Client, user_message: str, context: str) -> List[SuggestionAction]:
    """Generate intelligent follow-up suggestions using AI"""
    suggestion_prompt = f"""Based on the user's question and context, generate 2 to 3 relevant follow-up questions.

User question: {user_message}

Context: {context}

Requirements:
1. Generate 2 natural follow-up questions (each under 60 characters)
2. Use the SAME LANGUAGE as the user's question
3. Make them specific and helpful for learning more about the topic
4. The question is a predict question that user might ask next, and the answer is not in the context. Not ask user a new question.
5. Make sure the question is related to the topic and pregnancy related

Return ONLY a JSON array:
[
  {{"text": "Short Title", "query": "Full question?"}},
  {{"text": "Short Title", "query": "Full question?"}}
]"""

    try:
        response = await generate_with_retry(client, suggestion_prompt, max_retries=2)
        
        json_match = re.search(r'\[.*\]', response, re.DOTALL)
        if json_match:
            suggestions_data = json.loads(json_match.group())
            return [
                SuggestionAction(type="suggestion", text=s['text'], query=s['query'])
                for s in suggestions_data[:2]
            ]
    except Exception as e:
        print(f"Error generating AI suggestions: {e}")
    
    return []


@router.post("/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    client: genai.Client = Depends(get_ai_client),
    vector_search: VectorSearchService = Depends(get_vector_search),
    knowledge_base: KnowledgeBase = Depends(get_knowledge_base)
) -> ChatResponse:
    """Chat with AI assistant and return structured response with actions"""
    try:
        topic_context = knowledge_base.create_context_for_ai(request.message)
        relevant_pages = vector_search.search(request.message, top_k=5)
        
        # Build conversation history string if provided
        history_str = ""
        if request.history:
            history_str = "\n\nPrevious conversation:\n"
            for msg in request.history[-5:]:  # Last 5 messages to avoid token limit
                role_label = "User" if msg.role == "user" else "Assistant"
                history_str += f"{role_label}: {msg.content}\n"
        
        prompt = f"""{config.SYSTEM_CONTEXT}

{topic_context}
{history_str}
User question: {request.message}

Instructions:
1. Provide a concise, accurate answer (within 100 words)
2. Use information from the knowledge base context above
3. Consider the previous conversation if relevant
4. Recommend the most relevant pages from the available topics
5. Use the same language as the user's question
6. Be compassionate and supportive

Answer:"""

        try:
            response_text = await generate_with_retry(
                client, prompt, max_retries=config.GEMINI_RETRY_ATTEMPTS
            )
            
            # Generate AI-powered suggestions
            ai_suggestions = await generate_ai_suggestions(client, request.message, topic_context)
        except ServerError:
            response_text = create_fallback_response(request.message, knowledge_base)
            ai_suggestions = []
        
        actions = [
            *create_actions_from_pages(relevant_pages),
            *ai_suggestions
        ]
        
        return ChatResponse(response=response_text, actions=actions)
    
    except ClientError as e:
        raise HTTPException(status_code=400, detail=f"Invalid request: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")

