import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.routes import router as api_router
from app.database.database import init_db

# Initialize DB models
init_db()

app = FastAPI(
    title="AI Editing Tutor API",
    description="Agentic AI Editing Tutor backend powered by LangGraph, OpenCV, and SQLAlchemy",
    version="1.0.0"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Router
app.include_router(api_router, prefix="/api")

# Static directory for media files
MEDIA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "media")
os.makedirs(MEDIA_DIR, exist_ok=True)
app.mount("/media", StaticFiles(directory=MEDIA_DIR), name="media")

@app.get("/")
def root():
    return {
        "app": "AI Editing Tutor API",
        "status": "online",
        "architecture": "LangGraph ReAct Agent + Dynamic Component Assembly"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
