import os
import uuid
from typing import Optional, Dict, Any
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pydantic import BaseModel

from app.agents.react_agent import run_react_agent
from app.tools.media_tool import analyze_media
from app.tools.learning_profile_tool import get_learning_profile, update_learning_profile
from app.components.exercise_generator import generate_personalized_exercise

router = APIRouter()

MEDIA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "media")
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

@router.post("/chat")
def chat_endpoint(request: ChatRequest):
    """
    Triggers the LangGraph ReAct workflow for user editing queries.
    Returns final response, detected intent, assembled components, and activity trace.
    """
    if not request.query or not request.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")
    
    result = run_react_agent(
        query=request.query,
        user_id=request.user_id or "default_student",
        media_info=request.media_info
    )
    
    return {
        "final_answer": result.get("final_answer"),
        "detected_intent": result.get("detected_intent"),
        "selected_components": result.get("selected_components"),
        "react_trace": result.get("react_trace"),
        "tool_results": result.get("tool_results"),
        "observations": result.get("observations")
    }

@router.post("/upload")
async def upload_media_endpoint(file: UploadFile = File(...)):
    """
    Handles media upload and executes Tool 1 (Media Analyzer) on the file.
    """
    try:
        file_ext = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4().hex}_{file.filename}"
        filepath = os.path.join(MEDIA_DIR, unique_filename)

        with open(filepath, "wb") as f:
            content = await file.read()
            f.write(content)

        analysis = analyze_media(filepath)
        analysis["media_id"] = unique_filename
        analysis["filepath"] = filepath

        return {
            "status": "success",
            "message": "File uploaded and analyzed successfully",
            "media_info": analysis
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process file: {str(e)}")

@router.get("/profile/{user_id}")
def get_profile_endpoint(user_id: str):
    """
    Retrieves information from Tool 2 (Learning Profile).
    """
    return get_learning_profile(user_id)

@router.put("/profile/{user_id}")
def update_profile_endpoint(user_id: str, request: ProfileUpdateRequest):
    """
    Updates fields in Tool 2 (Learning Profile).
    """
    updates = {k: v for k, v in request.dict().items() if v is not None}
    return update_learning_profile(user_id, updates)

@router.get("/exercises/{user_id}")
def get_exercise_endpoint(user_id: str):
    """
    Generates a personalized exercise based on user learning profile weaknesses.
    """
    profile = get_learning_profile(user_id)
    exercise = generate_personalized_exercise(profile)
    return exercise
