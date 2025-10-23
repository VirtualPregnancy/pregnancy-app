import os
import json
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from google import genai
from pydantic import BaseModel
from dotenv import load_dotenv
from vector_search import PageVectorSearch
from action_builder import ActionBuilder

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# Initialize vector search
vector_search = PageVectorSearch(client)
frontend_dir = Path(__file__).parent.parent / "frontend"
vector_search.load_page_data(frontend_dir)
vector_search.generate_all_embeddings()

# Initialize action builder
action_builder = ActionBuilder()

# Load pregnancy data
data_dir = Path(__file__).parent.parent / "frontend" / "assets" / "data"
pregnancy_data = {}

try:
    with open(data_dir / "chatbotConfig.json", "r", encoding="utf-8") as f:
        pregnancy_data["chatbot"] = json.load(f)
    with open(data_dir / "topics.json", "r", encoding="utf-8") as f:
        pregnancy_data["topics"] = json.load(f)
    with open(data_dir / "supportData.json", "r", encoding="utf-8") as f:
        pregnancy_data["support"] = json.load(f)
    with open(data_dir / "modelData.json", "r", encoding="utf-8") as f:
        pregnancy_data["models"] = json.load(f)
except Exception:
    pass

# Create system prompt
def create_context():
    context = """You are a pregnancy health assistant for Aotearoa New Zealand. 

INSTRUCTIONS:
1. Answer questions using the Knowledge Base information provided below
2. If the Knowledge Base has relevant information, use it to answer helpfully
3. You can synthesize information from multiple sections to give a complete answer
4. Try to answer the question, uing your knowledge and the information from the Knowledge Base if you don't have detailed information about that, say: "I don't have detailed information about that. Please check with your midwife or healthcare provider."
5. Keep answers under 100 words, plain text only
6. Be compassionate, clear, and conversational
7. Use te reo Māori terms appropriately (pepi=baby, whānau=family, hapū=pregnant)
8. If users are asking a complication, encourage them first then provide the information.
9. Answer in English

The Knowledge Base covers pregnancy health topics specific to New Zealand, including changes during pregnancy, complications, ultrasound monitoring, midwife-led care, and support services.
"""
    return context


class ChatRequest(BaseModel):
    message: str


class SearchRequest(BaseModel):
    query: str
    top_k: int = 5


@app.get("/")
async def root():
    return {"status": "ok", "message": "Pregnancy AI Assistant"}


@app.post("/search")
async def search_pages(request: SearchRequest):
    """Search for most relevant pages based on query"""
    results = vector_search.search(request.query, request.top_k)
    return {
        "query": request.query,
        "results": results
    }


@app.post("/chat")
async def chat(request: ChatRequest):
    """Chat with AI assistant using relevant page context"""
    system_prompt = create_context()
    
    # Get more relevant pages for better actions (increased to 10)
    relevant_pages = vector_search.search(request.message, top_k=10, min_similarity=0.2)
    
    # Get detailed content for AI knowledge base
    detailed_knowledge = vector_search.get_detailed_context_for_ai(request.message, top_k=3)
    
    # Build comprehensive prompt
    prompt = f"""{system_prompt}

{detailed_knowledge}

User question: {request.message}

Please answer based on the Knowledge Base content provided above. Be helpful and informative."""

    response = client.models.generate_content(
        model="gemini-2.0-flash-exp",
        contents=prompt,
    )
    
    # Build actions using ActionBuilder (increased navigate to 4)
    actions = action_builder.build_actions(
        query=request.message,
        search_results=relevant_pages,
        max_navigate=4,
        max_suggest=2
    )
    
    return {
        "summary": response.text,
        "actions": actions
    }
