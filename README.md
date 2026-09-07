# AI Editing Tutor — Agentic AI Video/Audio/Image Masterclass

**AI Editing Tutor** is a functional agentic AI web application built with **LangGraph**, **FastAPI**, **React (Vite)**, **OpenCV**, and **SQLAlchemy**.

Unlike basic chatbots that simply answer prompts, **AI Editing Tutor** demonstrates genuine **agentic AI behavior** through an explicit **ReAct (Reason → Act → Observe → Repeat) execution loop**, **Dynamic Component Assembly**, and **operational tools**.

---

## 🌟 Core Agentic Architecture & Mandatory Requirements

### 1. ReAct (Reason → Act → Observe → Repeat) Execution Cycle
The agent operates on an explicit state machine graph constructed using **LangGraph**:

```
USER QUERY / MEDIA UPLOAD
          │
          ▼
   [Router Node] ──► Dynamic Component Assembly & Intent Classification
          │
          ▼
   [Reason Node] ◄─────────────────────────────────────┐
          │                                            │
   (Decides tool/action call)                          │
          │                                            │
   [Action Node] ──► Executes Tool 1 (Media) or        │ (ReAct Loop)
          │          Tool 2 (Learning Profile)         │
          ▼                                            │
  [Observe Node] ──► Evaluates observation result ─────┘
          │
          ▼
[Final Synthesis] ──► Skill-adapted response (Beginner/Inter/Adv)
```

The UI displays a live **Agent Activity / ReAct Trace** panel showing safe high-level action summaries without exposing internal prompts.

### 2. Dynamic Component Assembly
Components are NOT hard-coded into every execution. The system dynamically assembles required architectural components based on user intent:

- **Demo 1 (Knowledge)**: `[Question Router, Knowledge Retriever, Tutor]`
- **Demo 2 (Media Analysis)**: `[Question Router, Media Analyzer, Editing Analyzer, Tutor]`
- **Demo 3 (Style Recommendation)**: `[Question Router, Media Analyzer, Style Analyzer, Style Comparison, Tutor]`
- **Demo 4 (Exercise)**: `[Question Router, Learning Profile, Skill Assessor, Exercise Generator]`
- **Demo 5 (Multi-step ReAct)**: `[Question Router, Media Analyzer, Learning Profile, Skill Assessor, Exercise Generator, Tutor]`

### 3. Operational Tools
1. **Tool 1 — Media Analysis Tool (`analyze_media`)**:
   Utilizes OpenCV (`cv2`) and NumPy to extract duration, resolution, FPS, total frames, frame-to-frame scene cuts, average shot duration, and brightness metrics from uploaded media.
2. **Tool 2 — Learning Profile Tool (`get_learning_profile` / `update_learning_profile`)**:
   Manages student skill level, weak areas (e.g. pacing, sound transitions), completed exercises, average scores, and learning goals stored in PostgreSQL / SQLite database.

---

## 🛠️ Project Structure

```
ai-editing-tutor/
├── backend/
│   ├── app/
│   │   ├── agents/          # LangGraph ReAct Agent, State & Router
│   │   ├── components/      # Tutor, Style Analyzer, Exercise Generator
│   │   ├── tools/           # Media Analysis (OpenCV) & Profile Tools
│   │   ├── knowledge/       # Extensible JSON Knowledge Base
│   │   ├── database/        # SQLAlchemy Models & SQLite/Postgres Setup
│   │   ├── api/             # FastAPI REST Routes
│   │   └── main.py          # Application Server Entrypoint
│   ├── requirements.txt
│   └── venv/
├── frontend/
│   ├── src/
│   │   ├── components/      # ChatView, ReActTracePanel, MediaUploader, ProfileDashboard, ExerciseView
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── tests/                   # Pytest automated test suite
├── README.md
└── .env.example
```

---

## 🚀 Running the Project

### 1. Backend Server
```bash
cd backend
venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```
Backend API runs at `http://localhost:8000`.

### 2. Frontend Web UI
```bash
cd frontend
npm run dev
```
Frontend Web App runs at `http://localhost:3000`.

### 3. Run Automated Tests
```bash
backend\venv\Scripts\python -m pytest -o pythonpath=backend tests/
```

---

## 🎬 Demonstrating the 5 Core Demo Scenarios

1. **Demo 1 — Knowledge**: Click *"Demo 1: Knowledge"* or type *"What is a J-cut?"*. The agent routes strictly through Knowledge Retriever without calling unnecessary media analysis tools.
2. **Demo 2 — Media Analysis**: Upload a video or click *"Demo 2: Media Analysis"*. The agent triggers `analyze_media()` via OpenCV, calculates shot cut frequency and average shot duration, and diagnoses pacing issues.
3. **Demo 3 — Style Recommendation**: Click *"Demo 3: Style Recommendation"*. The agent evaluates footage metrics against editing styles (Cinematic, Documentary, YouTube, Vlog, Social Media) and presents recommendations with trade-offs.
4. **Demo 4 — Personalized Learning**: Click *"Demo 4: Exercise"*. The agent calls `get_learning_profile()`, identifies student weak areas, and generates a practice drill.
5. **Demo 5 — Multi-step ReAct Loop**: Click *"Demo 5: Multi-step ReAct"*. The agent executes a 3-iteration ReAct loop: `analyze_media` → `get_learning_profile` → `generate_exercise` → Final Answer synthesis!
markdown


# 🎬 AI Editing Tutor — Agentic AI Video/Audio/Image Masterclass
An agentic AI web app built with **LangGraph**, **FastAPI**, **React (Vite)**, **OpenCV**, and **SQLAlchemy**. Demonstrates genuine agentic behavior through an explicit **ReAct (Reason → Act → Observe → Repeat)** loop, **Dynamic Component Assembly**, and **3 operational tools**.
Works with **any AI provider** — Gemini (free), Groq (free), or OpenAI.
---
## 🌟 Core Architecture
### ReAct Execution Cycle (LangGraph)
USER QUERY │ [1. ROUTER] Classifies intent → assembles components dynamically │ [2. REASON] Decides which tool to call next │ [3. ACT] Runs Tool 1 / Tool 2 / Tool 3 │ [4. OBSERVE] Evaluates result → loop back or continue (ReAct Loop) │ [5. SYNTHESIZE] AI generates skill-adapted final response │ Response + full trace → shown live in UI



### Dynamic Component Assembly
| Intent | Assembled Pipeline |
|---|---|
| Knowledge | Question Router → Knowledge Retriever → Tutor |
| Media Analysis | Question Router → Media Analyzer → Editing Analyzer → Tutor |
| Style Recommendation | Question Router → Media Analyzer → Style Analyzer → Tutor |
| Exercise | Question Router → Learning Profile → Skill Assessor → Exercise Generator |
| Multi-step ReAct | Question Router → Media Analyzer → Learning Profile → Exercise Generator → Tutor |
| General | Question Router → Knowledge Retriever → Tutor |
### 3 Operational Tools
**Tool 1 — Media Analysis (`analyze_media`)**  
Uses OpenCV + NumPy. Extracts duration, resolution, FPS, scene cuts, brightness from uploaded video/image.
**Tool 2 — Learning Profile (`get/update_learning_profile`)**  
SQLAlchemy + SQLite. Stores skill level, weak areas, session count, learning goals per student.
**Tool 3 — Knowledge Search (`search_knowledge`)**  
Searches JSON knowledge bases (fundamentals, techniques, styles) + AI synthesizes a skill-adapted answer. Works for any question type.
---
## 🔑 API Key Independent
| Provider | Get Key | Prefix |
|---|---|---|
| Google Gemini (free) | https://aistudio.google.com/apikey | `AIzaSy...` |
| Groq (free, fast) | https://console.groq.com/keys | `gsk_...` |
| OpenAI | https://platform.openai.com/api-keys | `sk-...` |
Provider auto-detected from key prefix — no other config needed.
---
## 🚀 Running the Project
### 1. Configure key
```bash
cp .env.example backend/.env
# Edit backend/.env → OPENAI_API_KEY=your_key_here
2. Backend
bash


cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
API docs: http://localhost:8000/docs

3. Frontend
bash


cd frontend && npm install && npm run dev
App: http://localhost:3000

4. Terminal Tools Demo
bash


cd backend && python run_tools_demo.py
Or in browser: http://localhost:8000/api/tools/demo

5. Tests
bash


cd backend && python -m pytest ../tests/
🌐 API Endpoints
Method	Endpoint	Description
POST	/api/chat	Question → response + ReAct trace
POST	/api/upload	Upload media for OpenCV analysis
GET	/api/profile/{user_id}	Get learning profile
PATCH	/api/profile/{user_id}	Update learning profile
GET	/api/tools/demo	Run all 3 tools in browser
GET	/api/health	Server + provider status
🎬 Demo Scenarios
Knowledge — "What is a J-cut?" → Knowledge Retriever only
Media Analysis — Upload video → OpenCV analyzes scenes, FPS, brightness
Style Recommendation — "What style suits my footage?" → style comparison
Exercise — "Give me a practice drill" → loads profile + generates exercise
Multi-step ReAct — Upload video + ask for exercise → 3-iteration loop
📁 Project Structure


ai-editing-tutor/
├── backend/
│   ├── app/
│   │   ├── ai_client.py              # Provider-agnostic LLM
│   │   ├── main.py                   # FastAPI entry point
│   │   ├── agents/
│   │   │   ├── react_agent.py        # LangGraph 5-node ReAct loop
│   │   │   ├── router.py             # Intent classifier
│   │   │   └── state.py              # AgentState schema
│   │   ├── api/routes.py             # REST endpoints
│   │   ├── tools/
│   │   │   ├── media_tool.py         # Tool 1: OpenCV
│   │   │   ├── learning_profile_tool.py  # Tool 2: SQLAlchemy
│   │   │   └── knowledge_search_tool.py  # Tool 3: AI search
│   │   ├── knowledge/                # JSON knowledge bases
│   │   ├── database/                 # SQLAlchemy models
│   │   └── components/               # Tutor, StyleAnalyzer, ExerciseGenerator
│   ├── requirements.txt
│   └── run_tools_demo.py             # Terminal demo
├── frontend/src/
│   ├── App.jsx                       # ReAct trace wiring
│   ├── views/                        # Workstation views
│   └── components/                   # UI incl. ProcessDiagnosticsDrawer
└── tests/
🔧 Tech Stack
Layer	Technology
Agent Framework	LangGraph
AI Client	LangChain-OpenAI (OpenAI-compatible)
Backend	FastAPI + Uvicorn
Media Analysis	OpenCV + NumPy
Memory	SQLAlchemy + SQLite
Frontend	React 18 + Vite + Tailwind CSS
AI Providers	Gemini / Groq / OpenAI
---
4:03 PM




