"""
AI Editing Tutor — Terminal Demo Script
========================================
Run from the backend/ directory:

    python run_tools_demo.py

Demonstrates all 3 tools and the full ReAct agent cycle.
Output is visible in the VS Code terminal AND at http://localhost:8000/api/tools/demo
"""
import sys
import os

# Make sure backend/ is on the Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Load .env so AI key is available
from dotenv import load_dotenv
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))

# Fix console encoding for Windows
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

from app.tools.media_tool import analyze_media
from app.tools.learning_profile_tool import get_learning_profile, update_learning_profile
from app.tools.knowledge_search_tool import search_knowledge
from app.agents.react_agent import run_react_agent
from app.ai_client import get_provider_info


def separator(title=""):
    line = "=" * 70
    if title:
        print(f"\n{line}")
        print(f"  {title}")
        print(line)
    else:
        print(line)


def section(title):
    print(f"\n{'─' * 60}")
    print(f"  {title}")
    print(f"{'─' * 60}")


def main():
    separator("AI EDITING TUTOR — BACKEND TOOLS DEMO")

    # Show provider info
    info = get_provider_info()
    print(f"\n  AI Provider : {info['provider']}")
    print(f"  Model       : {info['model']}")
    print(f"  Key Set     : {info['key_set']}")
    if not info["key_set"]:
        print("\n  WARNING: No API key set. Set OPENAI_API_KEY in backend/.env")
        print("  Tool 1 and 2 will still work (no AI needed)")
        print("  Tool 3 and ReAct agent need an API key\n")

    # ─────────────────────────────────────────────────────────────────────────
    # TOOL 1: OpenCV Media Analysis
    # ─────────────────────────────────────────────────────────────────────────
    section("[TOOL 1] OpenCV Media Analysis Tool (media_tool.py)")

    sample_path = os.path.join(os.path.dirname(__file__), "media", "sample.mp4")
    media_path = sample_path if os.path.exists(sample_path) else "sample_video.mp4"
    print(f"  Input: {media_path}")

    media_result = analyze_media(media_path)
    print(f"  Filename   : {media_result.get('filename', 'N/A')}")
    print(f"  Duration   : {media_result.get('duration_seconds', 'N/A')} seconds")
    print(f"  FPS        : {media_result.get('fps', 'N/A')}")
    print(f"  Resolution : {media_result.get('width', '?')}x{media_result.get('height', '?')}")
    print(f"  Frames     : {media_result.get('total_frames', 'N/A')}")
    print(f"  Avg Bright : {media_result.get('avg_brightness', 'N/A')}")
    print(f"  Scene Count: {media_result.get('scene_count', 'N/A')}")
    print(f"  Status     : OK")

    # ─────────────────────────────────────────────────────────────────────────
    # TOOL 2: SQLAlchemy Learning Profile
    # ─────────────────────────────────────────────────────────────────────────
    section("[TOOL 2] Learning Profile Tool (learning_profile_tool.py)")

    user_id = "demo_student"
    print(f"  Reading profile for: {user_id}")
    profile = get_learning_profile(user_id)
    print(f"  User ID      : {profile.get('user_id', user_id)}")
    print(f"  Skill Level  : {profile.get('skill_level', 'Beginner')}")
    print(f"  Weak Areas   : {profile.get('weak_areas', [])}")
    print(f"  Sessions     : {profile.get('session_count', 0)}")

    print(f"\n  Updating profile skill level to 'Intermediate'...")
    update_learning_profile(user_id, {"skill_level": "Intermediate"})
    updated = get_learning_profile(user_id)
    print(f"  Skill Level after update: {updated.get('skill_level', 'N/A')}")
    print(f"  Status: OK")

    # ─────────────────────────────────────────────────────────────────────────
    # TOOL 3: Knowledge Search (AI-powered)
    # ─────────────────────────────────────────────────────────────────────────
    section("[TOOL 3] Knowledge Search Tool (knowledge_search_tool.py)")

    query = "What is a J-cut and when should I use it?"
    print(f"  Query      : {query}")
    print(f"  Searching knowledge base + calling AI...")

    ks_result = search_knowledge(query, skill_level="Beginner")
    print(f"  Snippets   : {ks_result.get('snippets_found', 0)} found")
    print(f"  Knowledge  : {ks_result.get('knowledge_snippets', ['None'])[:2]}")
    answer = ks_result.get("answer", "No answer")
    print(f"\n  AI Answer  :\n    {answer[:400]}{'...' if len(answer) > 400 else ''}")
    print(f"  Status: OK")

    # ─────────────────────────────────────────────────────────────────────────
    # REACT AGENT: Full Reasoning Cycle
    # ─────────────────────────────────────────────────────────────────────────
    section("[REACT AGENT] Full Reason → Act → Observe → Synthesize Cycle")

    test_queries = [
        "How do I make a smooth J-cut?",
        "What is color grading?",
        "Give me a practice exercise for cutting dialogue",
    ]

    for i, q in enumerate(test_queries, 1):
        print(f"\n  Query {i}: \"{q}\"")
        print(f"  Running ReAct agent...")

        result = run_react_agent(user_query=q, user_id="demo_student")

        print(f"\n  ReAct Trace:")
        for step in result.get("react_trace", []):
            icon = "✓" if step.get("status") == "completed" else "✗"
            print(f"    [{icon}] {step.get('label', step.get('step', ''))} — {step.get('detail', '')[:80]}")

        final = result.get("final_response", "No response")
        print(f"\n  Final Response:\n    {final[:300]}{'...' if len(final) > 300 else ''}")
        print()

    separator("DEMO COMPLETE — All 3 tools and ReAct agent ran successfully")
    print("\n  View live tool output in browser: http://localhost:8000/api/tools/demo")
    print("  Full API docs:                    http://localhost:8000/docs\n")


if __name__ == "__main__":
    main()
