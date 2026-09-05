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
    user_id: Optional[str]
    detected_intent: Optional[str]
    selected_components: List[str]
    tool_results: List[Dict[str, Any]]
    reasoning_steps: List[str]
    observations: List[str]
    final_answer: Optional[str]
    react_trace: List[Dict[str, Any]]  # Safe, high-level action/status summaries for UI
    next_action: Optional[str]
    pending_tool: Optional[Dict[str, Any]]
    iteration_count: int
    is_complete: bool
