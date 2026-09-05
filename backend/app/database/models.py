import datetime
import json
from sqlalchemy import Column, Integer, String, Text, DateTime, Float, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.database.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    profile = relationship("LearningProfile", back_populates="user", uselist=False)

class LearningProfile(Base):
    __tablename__ = "learning_profiles"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(String, ForeignKey("users.id"), unique=True)
    skill_level = Column(String, default="Beginner")  # Beginner, Intermediate, Advanced
    known_techniques_json = Column(Text, default="[]")
    weak_areas_json = Column(Text, default='["pacing", "transitions"]')
    completed_exercises_count = Column(Integer, default=0)
    average_score = Column(Float, default=75.0)
    learning_goals_json = Column(Text, default='["Master shot pacing", "Learn J-cuts and L-cuts"]')
    recent_feedback = Column(Text, default="Keep focusing on shot rhythm and transition timing.")
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="profile")

    @property
    def known_techniques(self):
        return json.loads(self.known_techniques_json) if self.known_techniques_json else []

    @known_techniques.setter
    def known_techniques(self, value):
        self.known_techniques_json = json.dumps(value)

    @property
    def weak_areas(self):
        return json.loads(self.weak_areas_json) if self.weak_areas_json else []

    @weak_areas.setter
    def weak_areas(self, value):
        self.weak_areas_json = json.dumps(value)

    @property
    def learning_goals(self):
        return json.loads(self.learning_goals_json) if self.learning_goals_json else []

    @learning_goals.setter
    def learning_goals(self, value):
        self.learning_goals_json = json.dumps(value)

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(String, index=True)
    query = Column(Text)
    intent = Column(String)
    components_selected_json = Column(Text)
    final_answer = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class MediaFile(Base):
    __tablename__ = "media_files"

    id = Column(String, primary_key=True, index=True)
    filename = Column(String)
    filepath = Column(String)
    media_type = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(String, primary_key=True, index=True)
    title = Column(String)
    target_weakness = Column(String)
    difficulty = Column(String)
    description = Column(Text)
    goals_json = Column(Text)
    evaluation_criteria_json = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class ExerciseAttempt(Base):
    __tablename__ = "exercise_attempts"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    exercise_id = Column(String, ForeignKey("exercises.id"))
    user_id = Column(String)
    score = Column(Float)
    feedback_text = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
