import os
from dotenv import load_dotenv

# Load .env before anything else
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", "..", ".env"))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.routes import router as api_router
from app.database.database import init_db
from app.ai_client import get_provider_info

# Initialize SQLite DB
init_db()

app = FastAPI(
    title="AI Editing Tutor API",
    description=(
        "Agentic AI Editing Tutor backend — LangGraph ReAct loop, "
        "OpenCV media analysis, SQLAlchemy memory, and 3 AI tools. "
        "Works with OpenAI, Gemini, or Groq API keys."
    ),
    version="2.0.0",
)

# CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API routes
app.include_router(api_router, prefix="/api")

# Serve uploaded media files
media_dir = os.path.join(os.path.dirname(__file__), "..", "media")
os.makedirs(media_dir, exist_ok=True)
app.mount("/media", StaticFiles(directory=media_dir), name="media")


@app.on_event("startup")
async def startup_event():
    info = get_provider_info()
    print(f"\n✅ AI Editing Tutor started")
    print(f"   Provider : {info['provider']}")
    print(f"   Model    : {info['model']}")
    print(f"   Key set  : {info['key_set']}")
    if not info["key_set"]:
        print("   ⚠️  No API key — set OPENAI_API_KEY in backend/.env")
    print(f"   Docs     : http://localhost:8000/docs\n")
