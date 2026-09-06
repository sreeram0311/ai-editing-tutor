"""
Question Router and Dynamic Component Assembly Module.
Classifies user intent and dynamically determines which architectural components are required.
Works for ALL question types — editing-specific and general.
"""
from typing import Dict, List, Tuple
import re

INTENT_COMPONENT_MAP: Dict[str, List[str]] = {
    "KNOWLEDGE": [
        "Question Router",
        "Knowledge Retriever",
        "Tutor"
    ],
    "MEDIA_ANALYSIS": [
        "Question Router",
        "Media Analyzer",
        "Editing Analyzer",
        "Tutor"
    ],
    "STYLE_RECOMMENDATION": [
        "Question Router",
        "Media Analyzer",
        "Style Analyzer",
        "Style Comparison",
        "Tutor"
    ],
    "EXERCISE": [
        "Question Router",
        "Learning Profile",
        "Skill Assessor",
        "Exercise Generator"
    ],
    "FEEDBACK": [
        "Question Router",
        "Media Analyzer",
        "Feedback Evaluator",
        "Progress Tracker",
        "Tutor"
    ],
    "MULTI_STEP_REACT": [
        "Question Router",
        "Media Analyzer",
        "Learning Profile",
        "Skill Assessor",
        "Exercise Generator",
        "Tutor"
    ],
    "TROUBLESHOOTING": [
        "Question Router",
        "Media Analyzer",
        "Technique Advisor",
        "Tutor"
    ],
    "GENERAL_EDITING": [
        "Question Router",
        "Knowledge Retriever",
        "Tutor"
    ],
    "GENERAL": [
        "Question Router",
        "Knowledge Retriever",
        "Tutor"
    ],
}

# ── Keyword classifiers ──────────────────────────────────────────────────────

_MEDIA_KEYWORDS = [
    "analyze", "video", "clip", "footage", "frame", "fps", "resolution",
    "upload", "file", "mp4", "mov", "this video", "my video", "my clip"
]

_STYLE_KEYWORDS = [
    "style", "recommend", "cinematic", "documentary", "vlog", "music video",
    "fast-paced", "slow", "aesthetic", "look", "feel", "genre"
]

_EXERCISE_KEYWORDS = [
    "exercise", "practice", "drill", "quiz", "test", "challenge", "assignment",
    "task", "improve", "learn by doing"
]

_FEEDBACK_KEYWORDS = [
    "feedback", "review", "critique", "assess", "evaluate", "what do you think",
    "how did i do", "rate my"
]

_TROUBLESHOOT_KEYWORDS = [
    "problem", "issue", "fix", "error", "wrong", "not working", "help me fix",
    "why does", "glitch", "bug", "artifact", "distortion"
]

_KNOWLEDGE_KEYWORDS = [
    "what is", "what are", "how do", "how to", "explain", "define", "tell me",
    "describe", "difference between", "when to use", "why", "cut", "transition",
    "color grading", "sound", "audio", "j-cut", "l-cut", "velocity", "timeline",
    "edit", "editing", "technique", "montage", "splice", "trim", "keyframe"
]


def classify_intent_and_assemble(query: str, has_media: bool = False) -> Tuple[str, List[str]]:
    """
    Classifies user query intent and dynamically assembles the required components.

    Args:
        query: The user's natural language query
        has_media: Whether the user uploaded a media file

    Returns:
        (intent_label, list_of_components)
    """
    q = query.lower().strip()

    # Media uploaded → always analyze it
    if has_media:
        if any(k in q for k in _STYLE_KEYWORDS):
            intent = "STYLE_RECOMMENDATION"
        elif any(k in q for k in _FEEDBACK_KEYWORDS):
            intent = "FEEDBACK"
        elif any(k in q for k in _EXERCISE_KEYWORDS):
            intent = "MULTI_STEP_REACT"
        else:
            intent = "MEDIA_ANALYSIS"
        return intent, INTENT_COMPONENT_MAP[intent]

    # No media — classify by keywords
    if any(k in q for k in _EXERCISE_KEYWORDS):
        intent = "EXERCISE"
    elif any(k in q for k in _TROUBLESHOOT_KEYWORDS):
        intent = "TROUBLESHOOTING"
    elif any(k in q for k in _FEEDBACK_KEYWORDS):
        intent = "FEEDBACK"
    elif any(k in q for k in _STYLE_KEYWORDS):
        intent = "STYLE_RECOMMENDATION"
    elif any(k in q for k in _MEDIA_KEYWORDS):
        intent = "MEDIA_ANALYSIS"
    elif any(k in q for k in _KNOWLEDGE_KEYWORDS):
        intent = "KNOWLEDGE"
    else:
        # Catch-all: treat any question as general (searches knowledge + AI answers)
        intent = "GENERAL"

    return intent, INTENT_COMPONENT_MAP[intent]
