"""
Exercise Generator Component
Generates personalized practice exercises tailored to the user's skill level and weak areas.
"""
from typing import Dict, Any, List

def generate_personalized_exercise(profile: Dict[str, Any]) -> Dict[str, Any]:
    """
    Creates a practical editing exercise targeting the user's identified weakness.
    """
    skill_level = profile.get("skill_level", "Beginner")
    weak_areas = profile.get("weak_areas", ["pacing"])
    primary_weakness = weak_areas[0] if weak_areas else "pacing"

    exercises = {
        "pacing": {
            "title": "Dynamic Pacing & Shot Duration Challenge",
            "target_weakness": "Pacing & Rhythm",
            "difficulty": skill_level,
            "description": "Assemble a 30-second sequence using 6-8 raw clips. Vary the shot duration to create an energetic build-up (start with 5s clips, accelerate down to 1.5s clips during the peak action).",
            "goals": [
                "Practice shot duration variation",
                "Cut on kinetic action beats",
                "Ensure smooth narrative progression without disorienting cuts"
            ],
            "evaluation_criteria": ["Appropriate shot duration curve", "Rhythm matching audio beats", "Clarity"]
        },
        "transitions": {
            "title": "J-Cut & L-Cut Audio Transition Drill",
            "target_weakness": "Audio Transitions",
            "difficulty": skill_level,
            "description": "Take two dialogue clips between two people. Edit 3 J-cuts where the incoming person's voice starts 1.5 seconds before their face appears, and 2 L-cuts showing their visual reaction.",
            "goals": [
                "Master J-cut overlap alignment",
                "Utilize reaction shots effectively",
                "Eliminate abrupt dialogue jump cuts"
            ],
            "evaluation_criteria": ["Smooth audio overlap", "Seamless visual cuts", "Reaction timing"]
        }
    }

    ex = exercises.get(primary_weakness, exercises["pacing"])
    ex["id"] = f"ex_{primary_weakness}_{skill_level.lower()}"
    return ex
