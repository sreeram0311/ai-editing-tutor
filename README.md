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
