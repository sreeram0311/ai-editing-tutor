import os
import uuid
from typing import Optional, Dict, Any

from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pydantic import BaseModel

from app.agents.react_agent import run_react_agent
from app.tools.media_tool import analyze_media
from app.tools.learning_profile_tool import get_learning_profile, update_learning_profile
from app.tools.knowledge_search_tool import search_knowledge
from app.ai_client import get_provider_info

router = APIRouter()

MEDIA_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
    "media"
)
os.makedirs(MEDIA_DIR, exist_ok=True)


class ChatRequest(BaseModel):
    query: str
    user_id: Optional[str] = "default_student"
    media_info: Optional[Dict[str, Any]] = None


class ProfileUpdateRequest(BaseModel):
    skill_level: Optional[str] = None
    weak_areas: Optional[list] = None
    known_techniques: Optional[list] = None
    recent_feedback: Optional[str] = None


# ── /api/chat ─────────────────────────────────────────────────────────────────

@router.post("/chat")
def chat_endpoint(request: ChatRequest):
    """
    Triggers the LangGraph ReAct workflow for any user query.
    Returns: final_response, react_trace, detected_intent, selected_components.
    Works for ALL question types — not just editing questions.
    """
    if not request.query or not request.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")

    result = run_react_agent(
        user_query=request.query.strip(),
        user_id=request.user_id or "default_student",
        uploaded_media=request.media_info,
    )

    return {
        "response": result.get("final_response", ""),
        "react_trace": result.get("react_trace", []),
        "detected_intent": result.get("detected_intent"),
        "selected_components": result.get("selected_components", []),
        "tool_results_count": len(result.get("tool_results", [])),
        "provider": get_provider_info(),
    }


# ── /api/upload ───────────────────────────────────────────────────────────────

@router.post("/upload")
async def upload_media(file: UploadFile = File(...)):
    """Saves uploaded media and runs OpenCV analysis."""
    file_id = str(uuid.uuid4())
    ext = os.path.splitext(file.filename or "upload")[1] or ".mp4"
    filepath = os.path.join(MEDIA_DIR, f"{file_id}{ext}")

    with open(filepath, "wb") as f:
        content = await file.read()
        f.write(content)

    analysis = analyze_media(filepath)

    return {
        "file_id": file_id,
        "filepath": filepath,
        "filename": file.filename,
        "analysis": analysis,
    }


# ── /api/profile ──────────────────────────────────────────────────────────────

@router.get("/profile/{user_id}")
def get_profile(user_id: str):
    """Returns the learning profile for a user."""
    return get_learning_profile(user_id)


@router.patch("/profile/{user_id}")
def update_profile(user_id: str, request: ProfileUpdateRequest):
    """Updates the learning profile for a user."""
    updates = {k: v for k, v in request.model_dump().items() if v is not None}
    return update_learning_profile(user_id, updates)


# ── /api/tools/demo ───────────────────────────────────────────────────────────

@router.get("/tools/demo")
def tools_demo():
    """
    Runs all 3 tools and returns their outputs.
    Viewable in browser at /api/tools/demo and runnable via backend/run_tools_demo.py.
    """
    results = {}

    # Tool 1: Media Analysis (OpenCV)
    sample_path = os.path.join(MEDIA_DIR, "sample.mp4")
    results["tool_1_media_analysis"] = analyze_media(
        sample_path if os.path.exists(sample_path) else "sample_video.mp4"
    )

    # Tool 2: Learning Profile (SQLAlchemy)
    results["tool_2_learning_profile"] = get_learning_profile("demo_user")

    # Tool 3: Knowledge Search (AI-powered)
    results["tool_3_knowledge_search"] = search_knowledge(
        query="What is a J-cut and when should I use it?",
        skill_level="Beginner"
    )

    return {
        "message": "All 3 tools executed successfully",
        "tools": results,
        "provider": get_provider_info(),
    }


# ── /api/health ───────────────────────────────────────────────────────────────

@router.get("/health")
def health():
    """Returns server status and AI provider info."""
    return {"status": "ok", "provider": get_provider_info()}
