"""
LangGraph ReAct Agent — Complete Implementation.
Explicit Reason → Act → Observe → Repeat loop with visible trace.
Handles ALL question types (editing-specific and general).
Uses provider-agnostic AI client (Gemini / Groq / OpenAI).
"""
from typing import Dict, Any
from langgraph.graph import StateGraph, END

from app.agents.state import AgentState
from app.agents.router import classify_intent_and_assemble
from app.tools.media_tool import analyze_media
from app.tools.learning_profile_tool import get_learning_profile, update_learning_profile
from app.tools.knowledge_search_tool import search_knowledge
from app.knowledge.knowledge_base import search_editing_knowledge
from app.ai_client import get_llm
from langchain_core.messages import HumanMessage, SystemMessage

MAX_ITERATIONS = 3


# ── Node 1: Router ───────────────────────────────────────────────────────────

def router_node(state: AgentState) -> Dict[str, Any]:
    """REASON Step 1 — Classifies intent and dynamically assembles components."""
    user_query = state.get("user_query", "")
    has_media = bool(state.get("uploaded_media"))

    intent, components = classify_intent_and_assemble(user_query, has_media=has_media)

    trace_entry = {
        "step": "router",
        "label": "🔍 Understanding question & assembling components",
        "detail": f"Intent: {intent} | Components: {', '.join(components)}",
        "status": "completed"
    }

    react_trace = list(state.get("react_trace", []))
    react_trace.append(trace_entry)

    return {
        "detected_intent": intent,
        "selected_components": components,
        "react_trace": react_trace,
        "iteration_count": 0,
        "tool_results": [],
    }


# ── Node 2: Reason ────────────────────────────────────────────────────────────

def reason_node(state: AgentState) -> Dict[str, Any]:
    """REASON Step 2 — Decides which tool to call next (or to synthesize)."""
    intent = state.get("detected_intent", "GENERAL")
    media = state.get("uploaded_media")
    tool_results = state.get("tool_results", [])
    iteration_count = state.get("iteration_count", 0) + 1
    executed_tools = {tr.get("tool") for tr in tool_results}

    next_action = "synthesize"
    pending_tool = None

    # Decide tool sequence based on intent
    needs_media = intent in ("MEDIA_ANALYSIS", "STYLE_RECOMMENDATION", "FEEDBACK",
                             "MULTI_STEP_REACT", "TROUBLESHOOTING")
    needs_profile = intent in ("EXERCISE", "MULTI_STEP_REACT", "FEEDBACK")
    needs_knowledge = intent in ("KNOWLEDGE", "GENERAL", "GENERAL_EDITING",
                                  "TROUBLESHOOTING")

    if needs_media and media and "analyze_media" not in executed_tools:
        next_action = "call_tool"
        pending_tool = {
            "name": "analyze_media",
            "args": {"media_path": media.get("filepath", "sample_video.mp4")}
        }
    elif needs_profile and "get_learning_profile" not in executed_tools:
        user_id = state.get("user_id", "default_student")
        next_action = "call_tool"
        pending_tool = {"name": "get_learning_profile", "args": {"user_id": user_id}}
    elif needs_knowledge and "search_knowledge" not in executed_tools:
        profile = state.get("user_profile", {})
        skill = profile.get("skill_level", "Beginner") if profile else "Beginner"
        next_action = "call_tool"
        pending_tool = {
            "name": "search_knowledge",
            "args": {"query": state.get("user_query", ""), "skill_level": skill}
        }
    elif not tool_results and "search_knowledge" not in executed_tools:
        # Always search knowledge for questions with no tool results yet
        next_action = "call_tool"
        pending_tool = {
            "name": "search_knowledge",
            "args": {"query": state.get("user_query", ""), "skill_level": "Beginner"}
        }

    if iteration_count >= MAX_ITERATIONS:
        next_action = "synthesize"

    trace_entry = {
        "step": "reason",
        "label": "🧠 Reasoning — deciding next action",
        "detail": (
            f"Iteration {iteration_count} | "
            f"Next: {pending_tool['name'] if pending_tool else 'synthesize final response'}"
        ),
        "status": "completed"
    }

    react_trace = list(state.get("react_trace", []))
    react_trace.append(trace_entry)

    return {
        "next_action": next_action,
        "pending_tool": pending_tool,
        "iteration_count": iteration_count,
        "react_trace": react_trace,
    }


# ── Node 3: Action ────────────────────────────────────────────────────────────

def action_node(state: AgentState) -> Dict[str, Any]:
    """ACT — Executes the chosen tool and records the observation."""
    pending_tool = state.get("pending_tool", {})
    tool_name = pending_tool.get("name", "")
    tool_args = pending_tool.get("args", {})

    result = {}
    error = None

    try:
        if tool_name == "analyze_media":
            result = analyze_media(tool_args.get("media_path", ""))
        elif tool_name == "get_learning_profile":
            result = get_learning_profile(tool_args.get("user_id", "default_student"))
        elif tool_name == "update_learning_profile":
            result = update_learning_profile(
                tool_args.get("user_id", "default_student"),
                tool_args.get("updates", {})
            )
        elif tool_name == "search_knowledge":
            result = search_knowledge(
                tool_args.get("query", ""),
                tool_args.get("skill_level", "Beginner")
            )
        else:
            result = {"error": f"Unknown tool: {tool_name}"}
    except Exception as e:
        error = str(e)
        result = {"tool": tool_name, "error": error}

    tool_result = {"tool": tool_name, "args": tool_args, "result": result}

    trace_entry = {
        "step": "action",
        "label": f"⚡ Acting — running tool: {tool_name}",
        "detail": (
            f"Tool: {tool_name} | "
            + (f"Error: {error}" if error else f"Result keys: {list(result.keys())}")
        ),
        "status": "error" if error else "completed"
    }

    react_trace = list(state.get("react_trace", []))
    react_trace.append(trace_entry)

    tool_results = list(state.get("tool_results", []))
    tool_results.append(tool_result)

    # Cache profile if we just loaded it
    updated = {}
    if tool_name == "get_learning_profile":
        updated["user_profile"] = result

    return {
        "tool_results": tool_results,
        "react_trace": react_trace,
        "pending_tool": None,
        **updated,
    }


# ── Node 4: Observe ───────────────────────────────────────────────────────────

def observe_node(state: AgentState) -> Dict[str, Any]:
    """OBSERVE — Evaluates tool output and decides whether to loop or synthesize."""
    tool_results = state.get("tool_results", [])
    last = tool_results[-1] if tool_results else {}
    last_result = last.get("result", {})
    iteration_count = state.get("iteration_count", 0)

    has_error = "error" in last_result
    observation = "Tool executed successfully." if not has_error else f"Tool error: {last_result.get('error')}"

    # Decide: continue looping or synthesize
    if iteration_count >= MAX_ITERATIONS:
        next_action = "synthesize"
        observation += " Max iterations reached — synthesizing final response."
    else:
        next_action = "reason"  # Loop back to reason for more tools

    trace_entry = {
        "step": "observe",
        "label": "👁 Observing tool result",
        "detail": observation,
        "status": "completed"
    }

    react_trace = list(state.get("react_trace", []))
    react_trace.append(trace_entry)

    return {
        "next_action": next_action,
        "react_trace": react_trace,
    }


# ── Node 5: Synthesis ─────────────────────────────────────────────────────────

def synthesis_node(state: AgentState) -> Dict[str, Any]:
    """SYNTHESIZE — Uses AI to compose the final response from all tool observations."""
    query = state.get("user_query", "")
    intent = state.get("detected_intent", "GENERAL")
    tool_results = state.get("tool_results", [])
    profile = state.get("user_profile", {})
    skill_level = profile.get("skill_level", "Beginner") if profile else "Beginner"

    # If knowledge search already produced an answer, use it directly
    for tr in tool_results:
        if tr.get("tool") == "search_knowledge":
            answer = tr.get("result", {}).get("answer", "")
            if answer:
                trace_entry = {
                    "step": "synthesize",
                    "label": "✅ Synthesizing final response",
                    "detail": f"Using knowledge search answer ({len(answer)} chars)",
                    "status": "completed"
                }
                react_trace = list(state.get("react_trace", []))
                react_trace.append(trace_entry)
                return {"final_response": answer, "react_trace": react_trace}

    # Otherwise use AI to synthesize from all tool observations
    observations = []
    for tr in tool_results:
        tool_name = tr.get("tool", "")
        result = tr.get("result", {})
        if tool_name == "analyze_media":
            observations.append(
                f"Media Analysis: {result.get('filename', 'video')} — "
                f"Duration: {result.get('duration_seconds', '?')}s, "
                f"FPS: {result.get('fps', '?')}, "
                f"Resolution: {result.get('width', '?')}x{result.get('height', '?')}, "
                f"Scenes: {result.get('scene_count', '?')}"
            )
        elif tool_name == "get_learning_profile":
            observations.append(
                f"Student Profile: Skill={result.get('skill_level', 'Beginner')}, "
                f"Weak areas={result.get('weak_areas', [])}"
            )
        elif "error" not in result:
            observations.append(f"{tool_name}: {str(result)[:200]}")

    obs_text = "\n".join(observations) if observations else "No tool data available."

    system_prompt = (
        f"You are an expert video/audio/image editing tutor. "
        f"The student is at {skill_level} level. "
        "Give a clear, helpful, structured response to their question. "
        "Base your answer on the observations from the tools. "
        "If no tool data is available, answer from your own knowledge."
    )
    user_prompt = (
        f"Student question: {query}\n\n"
        f"Tool observations:\n{obs_text}\n\n"
        "Provide a thorough, helpful response."
    )

    try:
        llm = get_llm(temperature=0.7)
        response = llm.invoke([
            SystemMessage(content=system_prompt),
            HumanMessage(content=user_prompt),
        ])
        final_response = response.content
    except Exception as e:
        final_response = f"Error generating response: {e}\n\nTool observations:\n{obs_text}"

    trace_entry = {
        "step": "synthesize",
        "label": "✅ Synthesizing final response",
        "detail": f"AI synthesized response ({len(final_response)} chars) from {len(tool_results)} tool(s)",
        "status": "completed"
    }

    react_trace = list(state.get("react_trace", []))
    react_trace.append(trace_entry)

    return {"final_response": final_response, "react_trace": react_trace}


# ── Routing logic ─────────────────────────────────────────────────────────────

def should_act_or_synthesize(state: AgentState) -> str:
    """Edge function: routes from reason_node to action or synthesis."""
    return "action" if state.get("next_action") == "call_tool" else "synthesize"


def should_loop_or_synthesize(state: AgentState) -> str:
    """Edge function: routes from observe_node back to reason or to synthesis."""
    return "reason" if state.get("next_action") == "reason" else "synthesize"


# ── Build the graph ───────────────────────────────────────────────────────────

def build_graph() -> StateGraph:
    graph = StateGraph(AgentState)

    graph.add_node("router",    router_node)
    graph.add_node("reason",    reason_node)
    graph.add_node("action",    action_node)
    graph.add_node("observe",   observe_node)
    graph.add_node("synthesize", synthesis_node)

    graph.set_entry_point("router")
    graph.add_edge("router", "reason")
    graph.add_conditional_edges("reason", should_act_or_synthesize, {
        "action":    "action",
        "synthesize": "synthesize",
    })
    graph.add_edge("action", "observe")
    graph.add_conditional_edges("observe", should_loop_or_synthesize, {
        "reason":    "reason",
        "synthesize": "synthesize",
    })
    graph.add_edge("synthesize", END)

    return graph.compile()


_compiled_graph = None


def run_react_agent(
    user_query: str,
    user_id: str = "default_student",
    uploaded_media: dict = None,
) -> Dict[str, Any]:
    """
    Entry point for the ReAct agent.
    Returns final_response, react_trace, detected_intent, selected_components.
    """
    global _compiled_graph
    if _compiled_graph is None:
        _compiled_graph = build_graph()

    initial_state: AgentState = {
        "user_query": user_query,
        "user_id": user_id,
        "uploaded_media": uploaded_media,
        "user_profile": None,
        "detected_intent": None,
        "selected_components": [],
        "pending_tool": None,
        "tool_results": [],
        "react_trace": [],
        "iteration_count": 0,
        "next_action": None,
        "final_response": None,
        "exercise": None,
    }

    final_state = _compiled_graph.invoke(initial_state)

    return {
        "final_response": final_state.get("final_response", "No response generated."),
        "react_trace": final_state.get("react_trace", []),
        "detected_intent": final_state.get("detected_intent"),
        "selected_components": final_state.get("selected_components", []),
        "tool_results": final_state.get("tool_results", []),
    }
