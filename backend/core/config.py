"""Configuration management for the application"""

import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()


class Config:
    """Application configuration"""
    
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    GEMINI_MODEL = "gemini-2.0-flash-lite"
    GEMINI_RETRY_ATTEMPTS = 3
    GEMINI_RETRY_DELAY = 1.0
    
    CORS_ORIGINS = ["*"]
    CORS_CREDENTIALS = True
    CORS_METHODS = ["*"]
    CORS_HEADERS = ["*"]
    
    BACKEND_DIR = Path(__file__).parent.parent
    FRONTEND_DIR = BACKEND_DIR.parent / "frontend"
    EMBEDDINGS_FILE = BACKEND_DIR / "data" / "embeddings.json"
    TOPICS_FILE = FRONTEND_DIR / "assets" / "data" / "topics.json"
    
    # AI Context
    SYSTEM_CONTEXT = """You are a pregnancy health assistant for Aotearoa New Zealand. 
You have access to comprehensive information about pregnancy, complications, support services, and care pathways in New Zealand.
You MUST ONLY answer questions that are related to context about pregnancy.

Key topics you can help with:
1. Pregnancy changes and fetal development
2. Complications: Fetal Growth Restriction (FGR), Gestational Diabetes Mellitus (GDM), Pre-eclampsia
3. Ultrasound and Doppler monitoring
4. Midwife-led care and LMC (Lead Maternity Carer) system
5. Regional support services across New Zealand
6. Mental health support (PADA, Whāraurau)

Available models/conditions:
- Normal pregnancy
- FGR - Fetal Growth Restriction 
- GDM - Gestational Diabetes Mellitus 

Always provide compassionate, evidence-based information. Use te reo Māori terms appropriately (e.g., pepi for baby, whānau for family, hapū for pregnant).
Your response should be in the same language as the user's question, in short answer and plain text.
Your answer should be within 100 words.

Don't include the page url in this reponse, add a stence at the end saying the following page(s) might help and a ':', and end, don't list the pages or if the question you don't know how to answer, you can say "I'm not sure about that, but I can help you find information about following:".
"""


config = Config()

