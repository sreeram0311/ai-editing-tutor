"""
Question Router and Dynamic Component Assembly Module.
Classifies user intent and dynamically determines which architectural components are required.
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
        "Planner",
        "Learning Profile",
        "Tutor"
    ]
}

def classify_intent_and_assemble(query: str, has_media: bool = False) -> Tuple[str, List[str]]:
    """
    Analyzes the user query and media availability to classify intent
    and dynamically assemble the required components.
    """
    q_lower = query.lower()

    # Check for Multi-step ReAct compound requests (Demo 5)
    if ("analyze" in q_lower or "check" in q_lower or "look at" in q_lower) and \
       ("weakness" in q_lower or "profile" in q_lower or "skill" in q_lower or "wrong" in q_lower) and \
       ("exercise" in q_lower or "task" in q_lower or "practice" in q_lower or "drill" in q_lower):
        intent = "MULTI_STEP_REACT"
    
    # Check for Exercise generation (Demo 4)
    elif any(kw in q_lower for kw in ["exercise", "practice", "drill", "task", "assignment", "test my knowledge"]):
        intent = "EXERCISE"

    # Check for Style Recommendation (Demo 3)
    elif any(kw in q_lower for kw in ["style", "cinematic", "documentary", "vlog", "youtube", "pacing preference", "which style"]):
        intent = "STYLE_RECOMMENDATION"

    # Check for Media Analysis / Pacing troubleshooting (Demo 2)
    elif has_media or any(kw in q_lower for kw in ["analyze my video", "analyze this", "pacing", "cuts", "boring", "slow", "shot duration", "fps", "resolution"]):
        if any(kw in q_lower for kw in ["feedback", "evaluate", "rate my edit", "grade"]):
            intent = "FEEDBACK"
        elif any(kw in q_lower for kw in ["unnatural", "fix transition", "broken transition"]):
            intent = "TROUBLESHOOTING"
        else:
            intent = "MEDIA_ANALYSIS"

    # Check for Editing Knowledge lookup (Demo 1)
    elif any(kw in q_lower for kw in [
        "what is", "explain", "how to", "definition", "j-cut", "l-cut", "jump cut", 
        "match cut", "smash cut", "cross-cutting", "montage", "b-roll", "speed ramp",
        "color correction", "color grade", "straight cut", "cutaway", "sound transition"
    ]):
        intent = "KNOWLEDGE"

    # Default fallback
    else:
        intent = "GENERAL_EDITING"

    components = INTENT_COMPONENT_MAP.get(intent, INTENT_COMPONENT_MAP["GENERAL_EDITING"])
    return intent, components
