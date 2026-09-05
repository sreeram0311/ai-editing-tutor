import pytest
from app.agents.router import classify_intent_and_assemble
from app.agents.react_agent import run_react_agent
from app.tools.media_tool import analyze_media
from app.tools.learning_profile_tool import get_learning_profile, update_learning_profile

def test_intent_classification():
    # Demo 1: Knowledge
    intent, components = classify_intent_and_assemble("What is a J-cut?")
    assert intent == "KNOWLEDGE"
    assert "Knowledge Retriever" in components
    assert "Tutor" in components

    # Demo 2: Media Analysis
    intent, components = classify_intent_and_assemble("Why does my video feel slow?", has_media=True)
    assert intent == "MEDIA_ANALYSIS"
    assert "Media Analyzer" in components

    # Demo 3: Style Recommendation
    intent, components = classify_intent_and_assemble("Which style would be better for this footage?")
    assert intent == "STYLE_RECOMMENDATION"
    assert "Style Analyzer" in components

    # Demo 4: Exercise
    intent, components = classify_intent_and_assemble("Give me an exercise based on my weaknesses.")
    assert intent == "EXERCISE"
    assert "Exercise Generator" in components

    # Demo 5: Multi-step ReAct
    intent, components = classify_intent_and_assemble("Analyze my video, identify my biggest weakness, and give me an exercise.")
    assert intent == "MULTI_STEP_REACT"
    assert "Media Analyzer" in components
    assert "Learning Profile" in components
    assert "Exercise Generator" in components

def test_media_analyzer_tool():
    # Test fallback / simulated media analysis tool
    result = analyze_media("non_existent_test_video.mp4")
    assert "duration" in result
    assert "shot_count" in result
    assert "average_shot_duration" in result

def test_learning_profile_tool():
    profile = get_learning_profile("test_user_123")
    assert profile["skill_level"] in ["Beginner", "Intermediate", "Advanced"]
    assert isinstance(profile["weak_areas"], list)

    updated = update_learning_profile("test_user_123", {"skill_level": "Intermediate"})
    assert updated["skill_level"] == "Intermediate"

def test_react_agent_execution():
    # Test full LangGraph ReAct flow execution (Demo 5 Multi-step)
    result = run_react_agent("Analyze my video, identify my weakness, and give me an exercise.")
    assert result["is_complete"] is True
    assert result["final_answer"] is not None
    assert len(result["react_trace"]) > 0
    # Check trace includes activity steps
    trace_steps = [t["step"] for t in result["react_trace"]]
    assert "router" in trace_steps
    assert "final_answer" in trace_steps
