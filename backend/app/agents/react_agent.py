"""
LangGraph ReAct Agent Implementation.
Implements explicit Reason -> Act -> Observe -> Repeat execution loop with state tracking,
dynamic component assembly, tool integration, and safe high-level activity trace generation.
"""
from typing import Dict, Any, List
import json

from langgraph.graph import StateGraph, END
from app.agents.state import AgentState
from app.agents.router import classify_intent_and_assemble
from app.tools.media_tool import analyze_media
from app.tools.learning_profile_tool import get_learning_profile, update_learning_profile
from app.knowledge.knowledge_base import search_editing_knowledge
from app.components.tutor import format_tutor_response
from app.components.style_analyzer import recommend_editing_style
from app.components.exercise_generator import generate_personalized_exercise

def router_node(state: AgentState) -> Dict[str, Any]:
    """
    Step 1: Router Node - Classifies query intent and dynamically assembles components.
    """
    user_query = state.get("user_query", "")
    has_media = bool(state.get("uploaded_media"))
    
    intent, components = classify_intent_and_assemble(user_query, has_media=has_media)
    
    trace_entry = {
        "step": "router",
        "label": "Understanding question & assembling components",
        "detail": f"Detected Intent: {intent} | Assembled: {', '.join(components)}",
        "status": "completed"
    }
    
    react_trace = list(state.get("react_trace", []))
    react_trace.append(trace_entry)
    
    return {
        "detected_intent": intent,
        "selected_components": components,
        "react_trace": react_trace,
        "iteration_count": 0
    }

def reason_node(state: AgentState) -> Dict[str, Any]:
    """
    Step 2: Reason Node - Evaluates current state and decides the next action or tool call.
    """
    query = state.get("user_query", "")
    intent = state.get("detected_intent", "GENERAL_EDITING")
    media = state.get("uploaded_media")
    profile = state.get("user_profile")
    tool_results = state.get("tool_results", [])
    iteration_count = state.get("iteration_count", 0) + 1
    
    executed_tools = [tr.get("tool") for tr in tool_results]
    next_action = None
    pending_tool = None
    
    # ReAct Decision Logic: Determine tool or synthesis step
    if (intent in ["MEDIA_ANALYSIS", "STYLE_RECOMMENDATION", "FEEDBACK", "MULTI_STEP_REACT", "TROUBLESHOOTING"] or media) and "analyze_media" not in executed_tools:
        next_action = "call_tool"
        pending_tool = {"name": "analyze_media", "args": {"media_path": media.get("filepath") if media else "sample_video.mp4"}}
    elif (intent in ["EXERCISE", "MULTI_STEP_REACT", "FEEDBACK", "GENERAL_EDITING"] or "weakness" in query.lower()) and "get_learning_profile" not in executed_tools:
        next_action = "call_tool"
        pending_tool = {"name": "get_learning_profile", "args": {"user_id": state.get("user_id", "default_student")}}
    elif intent == "KNOWLEDGE" and "search_editing_knowledge" not in executed_tools:
        next_action = "call_tool"
        pending_tool = {"name": "search_editing_knowledge", "args": {"query": query}}
    else:
        next_action = "synthesize_final_answer"

    reasoning_steps = list(state.get("reasoning_steps", []))
    reason_msg = f"Iteration {iteration_count}: Decided to {pending_tool['name'] if pending_tool else 'synthesize final response'} based on intent '{intent}'."
    reasoning_steps.append(reason_msg)
    
    react_trace = list(state.get("react_trace", []))
    trace_label = f"Evaluating action: {pending_tool['name']}" if pending_tool else "Generating personalized response"
    react_trace.append({
        "step": f"reason_{iteration_count}",
        "label": trace_label,
        "detail": reason_msg,
        "status": "completed"
    })
    
    return {
        "next_action": next_action,
        "pending_tool": pending_tool,
        "reasoning_steps": reasoning_steps,
        "react_trace": react_trace,
        "iteration_count": iteration_count
    }

def action_node(state: AgentState) -> Dict[str, Any]:
    """
    Step 3: Action Node - Executes real tools (Media Analyzer, Learning Profile, Knowledge Base).
    """
    pending = state.get("pending_tool")
    if not pending:
        return {}

    tool_name = pending.get("name")
    args = pending.get("args", {})
    
    result = {}
    if tool_name == "analyze_media":
        path = args.get("media_path", "video.mp4")
        result = analyze_media(path)
    elif tool_name == "get_learning_profile":
        uid = args.get("user_id", "default_student")
        result = get_learning_profile(uid)
    elif tool_name == "search_editing_knowledge":
        q = args.get("query", "")
        result = search_editing_knowledge(q)

    tool_results = list(state.get("tool_results", []))
    tool_results.append({"tool": tool_name, "args": args, "output": result})
    
    observations = list(state.get("observations", []))
    obs_summary = f"Observed result from {tool_name} tool."
    observations.append(obs_summary)
    
    react_trace = list(state.get("react_trace", []))
    react_trace.append({
        "step": f"action_{tool_name}",
        "label": f"Executed tool: {tool_name}",
        "detail": f"Successfully retrieved output from {tool_name}",
        "status": "completed"
    })

    updates = {
        "tool_results": tool_results,
        "observations": observations,
        "react_trace": react_trace,
        "pending_tool": None
    }
    if tool_name == "get_learning_profile":
        updates["user_profile"] = result

    return updates

def observe_node(state: AgentState) -> Dict[str, Any]:
    """
    Step 4: Observe Node - Evaluates tool observation results into state.
    """
    return {}

def final_synthesis_node(state: AgentState) -> Dict[str, Any]:
    """
    Step 5: Final Synthesis Node - Synthesizes tailored response adapted to user skill level.
    """
    query = state.get("user_query", "")
    profile = state.get("user_profile") or get_learning_profile(state.get("user_id", "default_student"))
    tool_results = state.get("tool_results", [])
    intent = state.get("detected_intent", "GENERAL_EDITING")

    # Extract tool outputs
    media_data = next((tr["output"] for tr in tool_results if tr["tool"] == "analyze_media"), None)
    knowledge_data = next((tr["output"] for tr in tool_results if tr["tool"] == "search_editing_knowledge"), None)
    
    if not knowledge_data:
        knowledge_data = search_editing_knowledge(query)

    style_data = None
    if intent in ["STYLE_RECOMMENDATION", "MEDIA_ANALYSIS"] or "style" in query.lower():
        metrics = media_data or {"duration": 60.0, "average_shot_duration": 6.5}
        style_data = recommend_editing_style(metrics, query)

    exercise_data = None
    if intent in ["EXERCISE", "MULTI_STEP_REACT"]:
        exercise_data = generate_personalized_exercise(profile)

    skill_level = profile.get("skill_level", "Beginner")
    final_ans = format_tutor_response(
        query=query,
        skill_level=skill_level,
        knowledge_data=knowledge_data,
        media_data=media_data,
        style_data=style_data,
        exercise_data=exercise_data
    )

    react_trace = list(state.get("react_trace", []))
    react_trace.append({
        "step": "final_answer",
        "label": "Final response synthesized",
        "detail": f"Generated response tailored to {skill_level} level.",
        "status": "completed"
    })

    return {
        "final_answer": final_ans,
        "is_complete": True,
        "react_trace": react_trace
    }

def decide_next_step(state: AgentState) -> str:
    """
    Conditional Edge Decider.
    """
    next_action = state.get("next_action")
    if next_action == "call_tool":
        return "action_node"
    return "final_synthesis_node"

# Build LangGraph Workflow Graph
builder = StateGraph(AgentState)

builder.add_node("router", router_node)
builder.add_node("reason", reason_node)
builder.add_node("action", action_node)
builder.add_node("observe", observe_node)
builder.add_node("final_synthesis", final_synthesis_node)

builder.set_entry_point("router")
builder.add_edge("router", "reason")

builder.add_conditional_edges(
    "reason",
    decide_next_step,
    {
        "action_node": "action",
        "final_synthesis_node": "final_synthesis"
    }
)

builder.add_edge("action", "observe")
builder.add_edge("observe", "reason")
builder.add_edge("final_synthesis", END)

react_agent = builder.compile()

def run_react_agent(query: str, user_id: str = "default_student", media_info: Dict[str, Any] = None) -> Dict[str, Any]:
    """
    Executes the LangGraph ReAct workflow and returns the final state including react_trace.
    """
    initial_state: AgentState = {
        "user_query": query,
        "uploaded_media": media_info,
        "user_profile": None,
        "user_id": user_id,
        "detected_intent": None,
        "selected_components": [],
        "tool_results": [],
        "reasoning_steps": [],
        "observations": [],
        "final_answer": None,
        "react_trace": [],
        "next_action": None,
        "pending_tool": None,
        "iteration_count": 0,
        "is_complete": False
    }

    final_state = react_agent.invoke(initial_state)
    return final_state
