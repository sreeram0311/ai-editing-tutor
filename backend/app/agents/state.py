from typing import TypedDict, List, Dict, Any, Optional


class AgentState(TypedDict):
    """
    Explicit Agent State schema for the LangGraph ReAct workflow.
    Tracks user input, profile context, active component assembly,
    tool execution results, reasoning trace, and final output synthesis.
    """
    user_query: str
    uploaded_media: Optional[Dict[str, Any]]
    user_profile: Optional[Dict[str, Any]]
    user_id: str
    detected_intent: Optional[str]
    selected_components: List[str]
    pending_tool: Optional[Dict[str, Any]]
    tool_results: List[Dict[str, Any]]
    react_trace: List[Dict[str, Any]]
    iteration_count: int
    next_action: Optional[str]
    final_response: Optional[str]
    exercise: Optional[Dict[str, Any]]
