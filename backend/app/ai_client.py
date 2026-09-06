"""
Provider-agnostic AI client for AI Editing Tutor.
Auto-detects provider from API key prefix:
  AIza / AQ.  → Google Gemini (free at aistudio.google.com)
  gsk_        → Groq (free at console.groq.com)
  sk-         → OpenAI (platform.openai.com)
"""
import os
from langchain_openai import ChatOpenAI


def _detect_provider(api_key: str) -> str:
    if not api_key:
        return "none"
    if api_key.startswith("AIza") or api_key.startswith("AQ."):
        return "Gemini"
    if api_key.startswith("gsk_"):
        return "Groq"
    if api_key.startswith("sk-"):
        return "OpenAI"
    return "Custom"


def get_llm(temperature: float = 0.7) -> ChatOpenAI:
    """
    Returns a LangChain ChatOpenAI-compatible LLM instance.
    Reads OPENAI_API_KEY, OPENAI_API_URL, OPENAI_MODEL from environment.
    Auto-detects base_url and model from key prefix if not explicitly set.
    """
    api_key = os.getenv("OPENAI_API_KEY", "")
    base_url = os.getenv("OPENAI_API_URL", "").strip()
    model = os.getenv("OPENAI_MODEL", "").strip()

    provider = _detect_provider(api_key)

    # Auto-detect base_url if not explicitly configured
    if not base_url:
        if provider == "Gemini":
            base_url = "https://generativelanguage.googleapis.com/v1beta/openai/"
        elif provider == "Groq":
            base_url = "https://api.groq.com/openai/v1/"
        else:
            base_url = "https://api.openai.com/v1/"

    # Auto-detect model if not explicitly configured
    if not model:
        if provider == "Gemini":
            model = "gemini-2.0-flash"
        elif provider == "Groq":
            model = "llama-3.3-70b-versatile"
        else:
            model = "gpt-4o-mini"

    return ChatOpenAI(
        api_key=api_key if api_key else "dummy-key",
        base_url=base_url,
        model=model,
        temperature=temperature,
    )


def get_provider_info() -> dict:
    """Returns the detected provider name and model for logging/display."""
    api_key = os.getenv("OPENAI_API_KEY", "")
    model = os.getenv("OPENAI_MODEL", "").strip()
    provider = _detect_provider(api_key)
    if not model:
        if provider == "Gemini":
            model = "gemini-2.0-flash"
        elif provider == "Groq":
            model = "llama-3.3-70b-versatile"
        else:
            model = "gpt-4o-mini"
    return {"provider": provider, "model": model, "key_set": bool(api_key)}
