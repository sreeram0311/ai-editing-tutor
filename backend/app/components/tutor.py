"""
Personalized Tutor Component — Comprehensive Editorial Knowledge & Multi-Software Explanations
Generates clean, plain-text answers mentioning all major editing software steps
(Premiere Pro, DaVinci Resolve, CapCut, Final Cut Pro, Avid, VEGAS, After Effects, Filmora)
without duplicated software blocks or messy symbols. Handles direct comparisons & theory.
"""
from typing import Dict, Any, List

COMPARISONS = {
    "j-cut vs l-cut": {
        "title": "J-Cut vs L-Cut Comparison & Rationale",
        "j_cut": "J-Cut (Audio Lead / Pre-lap): Audio from the upcoming scene begins BEFORE the visual cut. Used to smoothly introduce new scenes and guide viewer attention.",
        "l_cut": "L-Cut (Audio Lag / Post-lap): Audio from the current scene continues playing AFTER the visual cut to the next shot. Used for showing actor reaction shots while dialogue continues.",
        "verdict": "Neither is 'better'—they serve opposite storytelling goals. Experienced editors alternate J-cuts and L-cuts to maintain conversational flow.",
        "software": {
            "Premiere Pro": "Use Alt + Click to slip audio edges. J-Cut: drag audio left under previous clip. L-Cut: drag audio right under reaction shot.",
            "DaVinci Resolve": "Use Trim Tool (T) or Alt + Drag audio boundary independently on timeline.",
            "CapCut": "Tap Extract Audio, then drag audio clip boundary left (J-cut) or right (L-cut).",
            "Final Cut Pro": "Press Ctrl + S to Expand Audio Components, then drag audio start/end handles.",
            "Avid Media Composer": "Use Dual Roller Trim Tool (P) on audio tracks A1/A2 while keeping V1 video locked.",
            "VEGAS Pro": "Press U to unlink video and audio tracks, then drag audio event edges."
        }
    },
    "premiere vs resolve": {
        "title": "Premiere Pro vs DaVinci Resolve Comparison",
        "premiere": "Adobe Premiere Pro: Best for industry integration, Adobe Creative Cloud ecosystem (After Effects, Photoshop, Audition), fast timeline editing, and dynamic link.",
        "resolve": "DaVinci Resolve: World standard for color grading, node-based color workflow, Fairlight audio suite, Fusion visual effects, and one-time Studio license.",
        "verdict": "DaVinci Resolve is superior for color grading and finishing; Premiere Pro is preferred for motion graphics and seamless Adobe suite workflows.",
        "software": {
            "Premiere Pro": "Import raw footage, assemble edit on sequence timeline, use Dynamic Link to send shots to After Effects.",
            "DaVinci Resolve": "Import media in Cut/Edit page, perform primary/secondary grade in Color page, master audio in Fairlight.",
            "CapCut": "Ideal for fast mobile/social edits with built-in auto-captions and trending templates.",
            "Final Cut Pro": "Optimized for Apple Silicon hardware acceleration with magnetic timeline assembly."
        }
    },
    "jump cut vs match cut": {
        "title": "Jump Cut vs Match Cut Comparison",
        "jump_cut": "Jump Cut: A cut between two sequential takes of the same subject from almost identical camera angles. Condenses time, creates high-energy pacing, or jarring emphasis.",
        "match_cut": "Match Cut: A cut between two completely different subjects or spaces that share visual shape, action, or composition. Establishes artistic thematic connections.",
        "verdict": "Use Jump Cuts for fast YouTube/vlog pacing or passage of time. Use Match Cuts for cinematic transitions and thematic storytelling.",
        "software": {
            "Premiere Pro": "Jump Cut: Select razor tool (C), slice unwanted pause, press Shift + Delete (Ripple Delete). Match Cut: Align action frames across V1/V2 tracks.",
            "DaVinci Resolve": "Jump Cut: Use Blade tool (B) and Ripple Cut (Backspace). Match Cut: Use Split Screen to align shot compositions.",
            "CapCut": "Jump Cut: Tap Split and Delete unwanted pauses. Match Cut: Use Overlay feature to match framing.",
            "Final Cut Pro": "Jump Cut: Blade (Cmd + B) and Ripple Delete. Match Cut: Position playhead on matching motion frame."
        }
    },
    "24fps vs 30fps vs 60fps": {
        "title": "Frame Rate Comparison (24 FPS vs 30 FPS vs 60 FPS)",
        "fps_24": "24 FPS: Cinema standard. Provides natural motion blur and organic filmic cadence.",
        "fps_30": "30 FPS: TV broadcast and digital video standard. Slightly crisper motion blur.",
        "fps_60": "60 FPS / 120 FPS: High temporal resolution. Essential source footage for smooth 25% slow-motion speed ramps without stuttering.",
        "verdict": "Shoot 24 FPS for cinematic films; shoot 60 FPS / 120 FPS when planning speed ramps or slow-motion action shots.",
        "software": {
            "Premiere Pro": "Interpret Footage: Right-click clip > Modify > Interpret Footage > Assume 24.00 fps.",
            "DaVinci Resolve": "Clip Attributes: Right-click clip > Clip Attributes > Change Video Frame Rate to 24 fps.",
            "CapCut": "Project Settings: Set Frame Rate to 24fps or 60fps depending on export requirement.",
            "Final Cut Pro": "Video Inspector: Modify clip retiming to 24fps baseline."
        }
    },
    "prores vs h264": {
        "title": "ProRes vs H.264 Codec Comparison",
        "prores": "Apple ProRes (or Avid DNxHR): Intra-frame editing codec. Large file size, zero CPU strain, ultra-smooth timeline playback and scrubbing.",
        "h264": "H.264 / H.265 (HEVC): Inter-frame delivery codec. Small file size, heavy CPU decoding load, prone to scrubbing lag without proxies.",
        "verdict": "Edit in ProRes or generate ProRes proxies during editing; export H.264 / H.265 for final web delivery.",
        "software": {
            "Premiere Pro": "Ingest Settings: Enable Proxy Ingestion, select ProRes Proxy preset.",
            "DaVinci Resolve": "Generate Optimized Media: Right-click clips > Generate Proxy Media (ProRes).",
            "CapCut": "Enable Performance Acceleration in Preferences.",
            "Final Cut Pro": "Import Options: Check Create Transcoded Media > Proxy Media (ProRes)."
        }
    }
}

SOFTWARE_TUTORIALS = {
    "velocity": {
        "title": "Velocity Editing and Speed Ramping Tutorial",
        "concept": "Velocity editing alters clip playback speed dynamically, accelerating during build-ups and dropping into slow motion at impact beats.",
        "software": {
            "Premiere Pro": "Right-click clip > Show Clip Keyframes > Time Remapping > Speed. Add keyframes with Pen Tool (P) and split Bezier handles.",
            "DaVinci Resolve": "Press Cmd/Ctrl + R for Retime Controls. Add Speed Points, set entry to 300% and impact to 25%. Enable Optical Flow.",
            "CapCut": "Select clip > Speed > Curve. Drag entry dots to 3.0x and impact dots to 0.3x. Enable Make it Smoother.",
            "Final Cut Pro": "Press Shift + B (Blade Speed). Set speed header to 200% for buildup and 25% for action hit.",
            "Avid Media Composer": "Apply Timewarp Effect. Add keyframes on Speed graph, curving from 300% to 25%. Set Render FluidMotion.",
            "VEGAS Pro": "Right-click clip > Insert/Remove Envelope > Velocity. Add keyframes on velocity line from 300% to 30%."
        },
        "parameters": [
            "Normal Speed: 100% (24fps baseline)",
            "Fast Buildup: 250% to 450% speed during movement",
            "Action Impact Drop: 20% to 35% slow-mo (requires 60fps+ source)",
            "Optical Flow AI: Synthesizes missing frames to prevent stutter"
        ]
    },
    "j-cut": {
        "title": "J-Cuts and Audio Lead Transitions Guide",
        "concept": "A J-Cut is an edit where the audio of the upcoming shot precedes the visual cut.",
        "software": {
            "Premiere Pro": "Alt + Click audio boundary of Clip B. Drag audio edge left into Clip A's space. Apply 1.0s Constant Power crossfade.",
            "DaVinci Resolve": "Alt + Drag audio boundary of Clip B left. Use Trim Tool (T) to slip audio boundary independently.",
            "CapCut": "Tap Extract Audio, then drag audio stem 1.5s to the left under Clip A.",
            "Final Cut Pro": "Press Ctrl + S to Expand Audio Components, then drag audio leading edge left.",
            "Avid Media Composer": "Select Dual Roller Trim Tool (P). Deselect V1 track and trim Audio A1/A2 left.",
            "VEGAS Pro": "Press U to unlink Video and Audio. Slip audio event left into preceding clip."
        },
        "parameters": [
            "Audio Lead Time: 1.0s to 2.5s before visual cut",
            "Crossfade Shape: Constant Power (-3dB dip)"
        ]
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
    Synthesizes clean text responses without duplicated software blocks or messy symbols.
    """
    q_lower = query.lower()
    sections = []

    # 1. Check for specific comparison queries (vs / difference / which is better)
    comparison_key = None
    if "j-cut" in q_lower and "l-cut" in q_lower or "j cut vs l cut" in q_lower:
        comparison_key = "j-cut vs l-cut"
    elif "premiere" in q_lower and "resolve" in q_lower:
        comparison_key = "premiere vs resolve"
    elif "jump cut" in q_lower and "match cut" in q_lower:
        comparison_key = "jump cut vs match cut"
    elif "fps" in q_lower or "24fps" in q_lower or "60fps" in q_lower or "frame rate" in q_lower:
        comparison_key = "24fps vs 30fps vs 60fps"
    elif "prores" in q_lower or "h264" in q_lower or "codec" in q_lower:
        comparison_key = "prores vs h264"

    if comparison_key and comparison_key in COMPARISONS:
        cmp = COMPARISONS[comparison_key]
        sections.append(f"Concept: {cmp['title']}\n\nOverview:\n")
        for k, v in cmp.items():
            if k not in ['title', 'software', 'verdict']:
                sections.append(f"- {v}")
        sections.append(f"\nVerdict & Best Use Case: {cmp['verdict']}")
        
        sw_text = ["\nHow to perform in major editing software:\n"]
        for sw_name, instruction in cmp["software"].items():
            sw_text.append(f"- {sw_name}: {instruction}")
        sections.append("\n".join(sw_text))

        return "\n\n".join(sections)

    # 2. Check for specialized tutorials (velocity, j-cut)
    tutorial_key = None
    if "velocity" in q_lower or "speed ramp" in q_lower or "slow mo" in q_lower:
        tutorial_key = "velocity"
    elif "j-cut" in q_lower or "j cut" in q_lower:
        tutorial_key = "j-cut"

    if tutorial_key and tutorial_key in SOFTWARE_TUTORIALS:
        tut = SOFTWARE_TUTORIALS[tutorial_key]
        sections.append(f"Concept: {tut['title']}\n\nDefinition: {tut['concept']}")
        
        sw_text = ["\nHow to perform in major editing software:\n"]
        for sw_name, instruction in tut["software"].items():
            sw_text.append(f"- {sw_name}: {instruction}")
        sections.append("\n".join(sw_text))

        if "parameters" in tut:
            param_text = ["Technical Parameters:\n"]
            for p in tut["parameters"]:
                param_text.append(f"- {p}")
            sections.append("\n".join(param_text))

        return "\n\n".join(sections)

    # 3. Standard Knowledge Retrieval (Guaranteed UNIQUE Software Block Output)
    techs = knowledge_data.get("matched_techniques", []) if knowledge_data else []
    fund = knowledge_data.get("matched_fundamentals", []) if knowledge_data else []
    matched_styles = knowledge_data.get("matched_styles", []) if knowledge_data else []

    if techs:
        for t in techs[:2]:
            sec = [f"Concept: {t['name']}"]
            sec.append(f"Category: {t.get('category', 'Technique')}")
            sec.append(f"Definition: {t['definition']}")
            sec.append(f"Use Case: {t.get('use_case', 'General Editing')}")
            sections.append("\n".join(sec))
    elif fund:
        for f in fund[:2]:
            sections.append(f"Concept: {f['term']}\n\nDefinition: {f['definition']}\nPacing Impact: {f['pacing_impact']}")

    if matched_styles:
        st_parts = ["Recommended Editing Styles:\n"]
        for s in matched_styles[:2]:
            st_parts.append(f"Style: {s['name']}\n  - Pacing: {s['pacing']}\n  - Sound Design: {s['sound_design']}\n  - Color Look: {s['color']}")
        sections.append("\n\n".join(st_parts))

    # Append Software Execution Block ONCE at the end
    sections.append(
        "\nHow to perform in major editing software:\n"
        "- Premiere Pro: Select cut point and press Ctrl/Cmd + K to split clip\n"
        "- DaVinci Resolve: Trim Tool (T) or Blade Tool (B)\n"
        "- CapCut: Select clip, tap Split, then apply transition\n"
        "- Final Cut Pro: Blade (Cmd + B) or Ripple Trim (Option + [ or ])\n"
        "- Avid Media Composer: Add Edit (H) or Trim Roller (P)\n"
        "- VEGAS Pro: Press S to split clip at cursor and drag clip edges to crossfade"
    )

    if media_data and "status" not in media_data and "error" not in media_data:
        sections.append(f"OpenCV Media Inspection Report:\n"
                        f"  - Duration: {media_data.get('duration')}s\n"
                        f"  - FPS: {media_data.get('fps')}\n"
                        f"  - Resolution: {media_data.get('resolution')}\n"
                        f"  - Shot Cuts Detected: {media_data.get('shot_count')}\n"
                        f"  - Assessment: {media_data.get('pacing_assessment')}")

    return "\n\n".join(sections)
