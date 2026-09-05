"""
TOOL 2 — Learning Profile Tool
Retrieves and updates user learning profile: skill level, known techniques,
weak areas, completed exercises, scores, learning goals, and feedback history.
Stores data in PostgreSQL/SQLite database.
"""
from typing import Dict, Any, Optional
import json
from app.database.database import SessionLocal, init_db
from app.database.models import User, LearningProfile

# Ensure DB tables exist
init_db()

# In-memory default for fast lookup / initial fallback
_PROFILE_CACHE: Dict[str, Dict[str, Any]] = {}

def get_learning_profile(user_id: str = "default_student") -> Dict[str, Any]:
    """
    Retrieves information such as Skill level, Known techniques, Weak areas,
    Completed exercises, Previous scores, Learning goals, and Feedback history.
    """
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            # Create initial user & profile
            user = User(id=user_id, username=user_id)
            profile = LearningProfile(
                user_id=user_id,
                skill_level="Beginner",
                known_techniques_json=json.dumps(["Straight cut", "Crossfade"]),
                weak_areas_json=json.dumps(["pacing", "transitions", "audio sync"]),
                completed_exercises_count=2,
                average_score=78.5,
                learning_goals_json=json.dumps(["Master J-cuts & L-cuts", "Improve shot rhythm"]),
                recent_feedback="Work on varying shot lengths to avoid monotonic pacing."
            )
            db.add(user)
            db.add(profile)
            db.commit()
            db.refresh(profile)
        else:
            profile = user.profile
            if not profile:
                profile = LearningProfile(user_id=user_id)
                db.add(profile)
                db.commit()
                db.refresh(profile)

        res = {
            "user_id": user_id,
            "skill_level": profile.skill_level,
            "known_techniques": profile.known_techniques,
            "weak_areas": profile.weak_areas,
            "completed_exercises": profile.completed_exercises_count,
            "average_score": profile.average_score,
            "learning_goals": profile.learning_goals,
            "recent_feedback": profile.recent_feedback
        }
        _PROFILE_CACHE[user_id] = res
        return res
    except Exception as e:
        # Graceful fallback if DB fails
        if user_id in _PROFILE_CACHE:
            return _PROFILE_CACHE[user_id]
        return {
            "user_id": user_id,
            "skill_level": "Beginner",
            "known_techniques": ["Straight cut", "B-roll insertion"],
            "weak_areas": ["pacing", "sound transitions"],
            "completed_exercises": 1,
            "average_score": 75.0,
            "learning_goals": ["Improve cut pacing"],
            "recent_feedback": "Practice adjusting shot lengths based on audio rhythm."
        }
    finally:
        db.close()

def update_learning_profile(user_id: str, updates: Dict[str, Any]) -> Dict[str, Any]:
    """
    Updates specified fields in the user's learning profile.
    """
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if user and user.profile:
            profile = user.profile
            if "skill_level" in updates:
                profile.skill_level = updates["skill_level"]
            if "weak_areas" in updates:
                profile.weak_areas = updates["weak_areas"]
            if "known_techniques" in updates:
                profile.known_techniques = updates["known_techniques"]
            if "recent_feedback" in updates:
                profile.recent_feedback = updates["recent_feedback"]
            if "completed_exercises" in updates:
                profile.completed_exercises_count = updates["completed_exercises"]
            if "average_score" in updates:
                profile.average_score = updates["average_score"]
            db.commit()
        db.close()
    except Exception:
        pass
    
    current = get_learning_profile(user_id)
    current.update(updates)
    _PROFILE_CACHE[user_id] = current
    return current
