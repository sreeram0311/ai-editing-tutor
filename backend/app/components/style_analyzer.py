"""
Style Analyzer Component
Analyzes footage characteristics, evaluates multiple editing styles, and provides
contextual recommendations with trade-offs.
"""
from typing import Dict, Any

def recommend_editing_style(media_metrics: Dict[str, Any], user_goal: str = "") -> Dict[str, Any]:
    """
    Evaluates footage metrics and user goals to recommend a primary and alternative editing style.
    """
    duration = media_metrics.get("duration", 60.0)
    avg_shot = media_metrics.get("average_shot_duration", 5.0)

    if avg_shot < 3.0 or "fast" in user_goal.lower() or "tiktok" in user_goal.lower():
        rec = "YouTube / Short-Form High-Energy"
        why = "Your shot cuts are fast and punchy. A YouTube/vlog style with pop-up graphics and sound effects will maximize engagement."
        alt = "Cinematic Montage"
        alt_why = "Could build visual momentum, but might feel overly dramatic for fast-paced content."
    elif "interview" in user_goal.lower() or "documentary" in user_goal.lower() or avg_shot > 7.0:
        rec = "Documentary Storytelling"
        why = "Your footage contains longer takes or dialogue clips. A documentary approach preserves natural conversational flow."
        alt = "Narrative Drama"
        alt_why = "Adds emotional depth, but requires strict continuity cutting and subtle L-cuts."
    else:
        rec = "Cinematic Narrative"
        why = "Balanced shot lengths allow viewers to absorb atmosphere and visual details smoothly."
        alt = "Minimalist Modern"
        alt_why = "Clean and uncluttered, though it relies heavily on pristine color grading."

    return {
        "recommended": rec,
        "why": why,
        "alternative": alt,
        "alt_why": alt_why,
        "suggested_techniques": ["J-cut", "L-cut", "B-roll Insertion", "Color Temperature Balance"],
        "workflow": "1. Assemble A-roll cuts -> 2. Insert B-roll overlays -> 3. Add J-cut audio leads -> 4. Apply color grade."
    }
