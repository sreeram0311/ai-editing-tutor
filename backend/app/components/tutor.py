"""
Personalized Tutor Component — Clean Text & Multi-Software Explanations
Generates clean, plain-text answers mentioning all major editing software steps
(Premiere Pro, DaVinci Resolve, CapCut, Final Cut Pro, Avid, VEGAS, After Effects, Filmora)
without extra special characters or messy symbols.
"""
from typing import Dict, Any, List

SOFTWARE_TUTORIALS = {
    "velocity": {
        "title": "Velocity Editing and Speed Ramping Tutorial",
        "concept": "Velocity editing alters clip playback speed dynamically, accelerating during build-ups and dropping into slow motion at impact beats.",
        "software": {
            "Premiere Pro": [
                "1. Right-click clip on timeline, select Show Clip Keyframes, then Time Remapping, then Speed.",
                "2. Use the Pen Tool (P) to add keyframes on the speed rubber band line.",
                "3. Drag the line segment before impact up to 300 percent and after impact down to 25 percent.",
                "4. Pull the split Bezier handles to smooth out the speed curve."
            ],
            "DaVinci Resolve": [
                "1. Select clip and press Cmd/Ctrl + R for Retime Controls or Shift + F6 for Retime Curve.",
                "2. Click the dropdown arrow on clip header and select Add Speed Point at motion entry.",
                "3. Set entry segment to 300 percent speed and action segment to 25 percent speed.",
                "4. Open Inspector, set Retime Process to Optical Flow and Motion Estimation to Speed Warp."
            ],
            "CapCut (Desktop and Mobile)": [
                "1. Select video clip, tap Speed, then tap Curve.",
                "2. Choose Custom mode or presets like Flash or Hero.",
                "3. Drag entry beat dots up to 3.0x and impact beat dots down to 0.3x.",
                "4. Select Make it Smoother and choose Better Quality for optical frame generation."
            ],
            "Final Cut Pro": [
                "1. Select clip and press Shift + B (Blade Speed) at ramp start and end.",
                "2. Click speed header bar and drag speed slider to 200 percent for buildup and 25 percent for action hit.",
                "3. Drag smooth transition handles to round out velocity curves."
            ],
            "Avid Media Composer": [
                "1. Open Motion Effect Palette, select Timewarp Effect and apply to clip.",
                "2. Open Motion Effect Editor and select Speed graph.",
                "3. Add keyframes on speed graph, curving from 300 percent down to 25 percent.",
                "4. Set Render FluidMotion to ON for frame interpolation."
            ],
            "VEGAS Pro": [
                "1. Right-click clip, select Insert/Remove Envelope, then click Velocity.",
                "2. Double-click green velocity line to add keyframes.",
                "3. Drag line up to 300 percent before action, drop line down to 30 percent at hit beat."
            ],
            "After Effects": [
                "1. Right-click layer, select Time, then Enable Time Remapping (Ctrl+Alt+T).",
                "2. Set keyframes at action entry and hit point.",
                "3. Open Graph Editor and drag Bezier handles to create S-curve speed ramp.",
                "4. Enable Pixel Motion Frame Blending."
            ],
            "Filmora": [
                "1. Select clip, click Speed icon, then select Speed Ramping.",
                "2. Choose Hero or Customize velocity graph.",
                "3. Adjust speed keyframe nodes up to 4x and down to 0.25x."
            ]
        },
        "parameters": [
            "Normal Speed: 100 percent (24fps or 30fps baseline)",
            "Fast Buildup: 250 to 450 percent speed during movement",
            "Action Impact Drop: 20 to 35 percent slow-mo (requires 60fps or 120fps source)",
            "Optical Flow AI: Synthesizes missing frames to prevent stutter"
        ],
        "quiz": {
            "question": "What is required to achieve smooth slow-motion during a velocity drop to 25 percent without jitter?",
            "options": [
                "A) Record in high frame rate (60fps or 120fps) or enable Optical Flow interpolation",
                "B) Increase brightness level by 50 percent",
                "C) Apply a heavy Gaussian blur"
            ],
            "answer": "A) Record in high frame rate (60fps or 120fps) or enable Optical Flow interpolation",
            "explanation": "Playing 24fps video at 25 percent speed results in only 6 frames per second, causing stutters unless shot in high FPS or processed with Optical Flow frame synthesis."
        }
    },
    "j-cut": {
        "title": "J-Cuts and Audio Lead Transitions Guide",
        "concept": "A J-Cut is an edit where the audio of the upcoming shot precedes the visual cut.",
        "software": {
            "Premiere Pro": [
                "1. Alt/Option + Click the audio boundary of Clip B.",
                "2. Drag the audio edge left into Clip A's timeline space.",
                "3. Apply 1.0s Constant Power audio crossfade."
            ],
            "DaVinci Resolve": [
                "1. Alt/Option + Drag audio boundary of Clip B left.",
                "2. Use Trim Tool (T) to slip audio boundary independently."
            ],
            "CapCut": [
                "1. Select Clip B and tap Extract Audio.",
                "2. Drag audio stem 1.5s to the left under Clip A."
            ],
            "Final Cut Pro": [
                "1. Expand Audio/Video components (Ctrl + S).",
                "2. Drag audio leading edge to the left."
            ],
            "Avid Media Composer": [
                "1. Select Dual Roller Trim Tool (P).",
                "2. Deselect Video track V1 and trim Audio track A1/A2 to the left."
            ],
            "VEGAS Pro": [
                "1. Unlink Video and Audio (press U).",
                "2. Slip audio event left into preceding clip."
            ]
        },
        "parameters": [
            "Audio Lead Time: 1.0s to 2.5s before visual cut",
            "Crossfade Shape: Constant Power (-3dB dip)"
        ],
        "quiz": {
            "question": "Why are J-cuts used in dialogue and documentary editing?",
            "options": [
                "A) To guide the viewer's subconscious attention before introducing a new visual scene",
                "B) To make the video render 2x faster",
                "C) To invert the color saturation"
            ],
            "answer": "A) To guide the viewer's subconscious attention before introducing a new visual scene",
            "explanation": "Hearing sound before visual cuts prepares the viewer's brain and smooths hard visual cuts."
        }
    }
}

def format_tutor_response(
    query: str,
    skill_level: str,
    knowledge_data: Dict[str, Any],
    media_data: Dict[str, Any] = None,
    style_data: Dict[str, Any] = None,
    exercise_data: Dict[str, Any] = None
) -> str:
    """
    Synthesizes clean text responses without extra special characters or messy tabs.
    """
    q_lower = query.lower()
    level = (skill_level or "Beginner").capitalize()
    sections = []

    tutorial_key = None
    if "velocity" in q_lower or "speed ramp" in q_lower or "slow mo" in q_lower:
        tutorial_key = "velocity"
    elif "j-cut" in q_lower or "j cut" in q_lower:
        tutorial_key = "j-cut"

    if tutorial_key and tutorial_key in SOFTWARE_TUTORIALS:
        tut = SOFTWARE_TUTORIALS[tutorial_key]
        sections.append(f"{tut['title']}\n\nOverview: {tut['concept']}")
        
        sw_text = ["How to do this in major editing software:\n"]
        for sw_name, steps in tut["software"].items():
            sw_text.append(f"{sw_name}:")
            for s in steps:
                sw_text.append(f"  {s}")
            sw_text.append("")
        sections.append("\n".join(sw_text))

        param_text = ["Technical Parameters:\n"]
        for p in tut["parameters"]:
            param_text.append(f"  - {p}")
        sections.append("\n".join(param_text))

        qz = tut["quiz"]
        quiz_text = [
            "Editor Knowledge Check:\n",
            f"Question: {qz['question']}\n",
            "\n".join([f"  {opt}" for opt in qz['options']]),
            f"\nCorrect Answer: {qz['answer']}",
            f"Explanation: {qz['explanation']}"
        ]
        sections.append("\n".join(quiz_text))

    else:
        techs = knowledge_data.get("matched_techniques", []) if knowledge_data else []
        fund = knowledge_data.get("matched_fundamentals", []) if knowledge_data else []
        matched_styles = knowledge_data.get("matched_styles", []) if knowledge_data else []

        if techs:
            for t in techs[:2]:
                sec = [f"Concept: {t['name']}"]
                sec.append(f"Category: {t.get('category', 'Technique')}")
                sec.append(f"Definition: {t['definition']}")
                sec.append(f"Use Case: {t['use_case']}")
                sec.append(f"\nHow to perform in major editing software:")
                sec.append("  - Premiere Pro: Select cut point and press Ctrl/Cmd + K to split clip")
                sec.append("  - DaVinci Resolve: Trim Tool (T) or Blade Tool (B)")
                sec.append("  - CapCut: Select clip, tap Split, then apply transition")
                sec.append("  - Final Cut Pro: Blade (Cmd + B) or Ripple Trim (Option + [ or ])")
                sec.append("  - Avid Media Composer: Add Edit (H) or Trim Roller (P)")
                sec.append("  - VEGAS Pro: Press S to split clip at cursor and drag clip edges to crossfade")
                sections.append("\n".join(sec))
        elif fund:
            for f in fund[:2]:
                sections.append(f"Principle: {f['term']}\n\nOverview: {f['definition']}\nPacing Impact: {f['pacing_impact']}")

        if matched_styles:
            st_parts = ["Recommended Editing Styles:\n"]
            for s in matched_styles[:2]:
                st_parts.append(f"Style: {s['name']}\n  - Pacing: {s['pacing']}\n  - Sound Design: {s['sound_design']}\n  - Color Look: {s['color']}")
            sections.append("\n\n".join(st_parts))

    if media_data and "status" not in media_data and "error" not in media_data:
        sections.append(f"OpenCV Media Inspection Report:\n"
                        f"  - Duration: {media_data.get('duration')}s\n"
                        f"  - FPS: {media_data.get('fps')}\n"
                        f"  - Resolution: {media_data.get('resolution')}\n"
                        f"  - Shot Cuts Detected: {media_data.get('shot_count')}\n"
                        f"  - Assessment: {media_data.get('pacing_assessment')}")

    if style_data:
        sections.append(f"Style Recommendation:\n"
                        f"  - Recommended Style: {style_data.get('recommended')}\n"
                        f"  - Why it fits: {style_data.get('why')}")

    if exercise_data:
        sections.append(f"Practice Exercise:\n"
                        f"  - Title: {exercise_data.get('title')}\n"
                        f"  - Task: {exercise_data.get('description')}")

    return "\n\n".join(sections)
