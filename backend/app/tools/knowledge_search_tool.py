"""
Tool 3: Knowledge Search Tool
Searches the built-in editing knowledge base (fundamentals.json, techniques.json, styles.json)
and uses the AI to synthesize a clear, skill-adapted answer.

This is the 3rd registered agent tool alongside:
  Tool 1: analyze_media  (OpenCV media analysis)
  Tool 2: get/update_learning_profile  (SQLAlchemy user profile)
"""
from typing import Dict, Any, List
from app.knowledge.knowledge_base import search_editing_knowledge
from app.ai_client import get_llm
from langchain_core.messages import HumanMessage, SystemMessage


def search_knowledge(query: str, skill_level: str = "Beginner") -> Dict[str, Any]:
    """
    Searches the editing knowledge base and returns an AI-synthesized answer.

    Args:
        query: The user's question (any topic — editing or general)
        skill_level: "Beginner" | "Intermediate" | "Advanced"

    Returns:
        dict with: tool, query, snippets_found, knowledge_snippets, answer
    """
    # ── Step 1: Search the JSON knowledge base ─────────────────────────────
    raw_results = search_editing_knowledge(query)

    # knowledge_base returns a dict — flatten to list of readable snippets
    snippets: List[str] = []
    if isinstance(raw_results, dict):
        for section, items in raw_results.items():
            if isinstance(items, list):
                for item in items:
                    if isinstance(item, dict):
                        snippets.append(f"[{section}] {item.get('title', '')} — {item.get('description', item.get('definition', ''))}")
                    elif isinstance(item, str):
                        snippets.append(f"[{section}] {item}")
            elif isinstance(items, str):
                snippets.append(f"[{section}] {items}")
    elif isinstance(raw_results, list):
        snippets = [str(s) for s in raw_results]

    # ── Step 2: AI synthesizes an answer ───────────────────────────────────
    context = "\n".join(snippets[:5]) if snippets else "No specific knowledge entry found."

    system_prompt = (
        f"You are an expert video/audio/image editing tutor. "
        f"The student is at {skill_level} level. "
        "Use the provided knowledge context to answer clearly and helpfully. "
        "If the question is not editing-specific, still answer it accurately and helpfully. "
        "Keep your answer concise (2-4 paragraphs)."
    )
    user_prompt = (
        f"Knowledge context:\n{context}\n\n"
        f"Student question: {query}\n\n"
        f"Provide a clear answer appropriate for a {skill_level} student."
    )

    try:
        llm = get_llm(temperature=0.5)
        response = llm.invoke([
            SystemMessage(content=system_prompt),
            HumanMessage(content=user_prompt),
        ])
        answer = response.content
    except Exception as e:
        answer = f"[AI unavailable: {e}] Based on knowledge base: {context}"

    return {
        "tool": "search_knowledge",
        "query": query,
        "snippets_found": len(snippets),
        "knowledge_snippets": snippets[:5],
        "answer": answer,
        "skill_level": skill_level,
    }
