import sys
import os
from dotenv import load_dotenv

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))

if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

from app.agents.react_agent import run_react_agent

def main():
    print("======================================================================")
    print("  AI EDITING TUTOR — INTERACTIVE TERMINAL")
    print("======================================================================")
    print("Type 'exit' or 'quit' to stop.\n")
    
    user_id = "demo_student"
    
    while True:
        try:
            q = input("\nAsk a question: ")
            if q.lower() in ['exit', 'quit']:
                break
            if not q.strip():
                continue
            
            print(f"  Running ReAct agent...\n")
            result = run_react_agent(user_query=q, user_id=user_id)
            
            print(f"  ReAct Trace:")
            for step in result.get("react_trace", []):
                icon = "✓" if step.get("status") == "completed" else "✗"
                print(f"    [{icon}] {step.get('label', step.get('step', ''))} — {step.get('detail', '')[:80]}")

            final = result.get("final_response", "No response")
            print(f"\n  Final Response:\n    {final}\n")
        except KeyboardInterrupt:
            break
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    main()
