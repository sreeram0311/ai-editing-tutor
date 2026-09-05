"""
Knowledge base retriever helper module.
Extensive search across fundamental concepts, cutting techniques, sound editing,
visual techniques, color grading, and 17+ editing styles.
"""
import os
import json
from typing import Dict, Any, List

KNOWLEDGE_DIR = os.path.dirname(os.path.abspath(__file__))

def _load_json(filename: str) -> Dict[str, Any]:
    path = os.path.join(KNOWLEDGE_DIR, filename)
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {}

def search_editing_knowledge(query: str) -> Dict[str, Any]:
    """
    Searches fundamental concepts, techniques, audio/visual methods, and editing styles for matching terms.
    """
    q_words = [w.strip().lower() for w in query.lower().split() if len(w.strip()) > 2]
    q_full = query.lower()

    fundamentals = _load_json("fundamentals.json").get("fundamentals", [])
    techniques = _load_json("techniques.json").get("techniques", [])
    styles = _load_json("styles.json").get("styles", [])

    matched_fundamentals = []
    for f in fundamentals:
        term = f["term"].lower()
        if term in q_full or any(w in term for w in q_words):
            matched_fundamentals.append(f)

    matched_techniques = []
    for t in techniques:
        name = t["name"].lower()
        cat = t.get("category", "").lower()
        desc = t.get("definition", "").lower()
        if name in q_full or q_full in name or any(w in name for w in q_words) or any(w in cat for w in q_words):
            matched_techniques.append(t)

    matched_styles = []
    for s in styles:
        sname = s["name"].lower()
        if sname in q_full or q_full in sname or any(w in sname for w in q_words):
            matched_styles.append(s)

    # Fallback if no specific keyword matched
    if not matched_fundamentals and not matched_techniques and not matched_styles:
        matched_techniques = techniques[:3]
        matched_fundamentals = fundamentals[:2]
        matched_styles = styles[:3]

    return {
        "query": query,
        "matched_fundamentals": matched_fundamentals,
        "matched_techniques": matched_techniques,
        "matched_styles": matched_styles
    }
