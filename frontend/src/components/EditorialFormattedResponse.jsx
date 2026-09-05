import React from 'react';
import { Film, Monitor, Sliders, CheckCircle2, BookOpen, Layers } from 'lucide-react';

export default function EditorialFormattedResponse({ rawText, userSkill }) {
  if (!rawText) return null;

  // Helper to parse key sections from raw string response
  const parseSections = (text) => {
    // Check if text has "How to perform in major editing software:" or similar sections
    const softwareMatch = text.match(/How to perform in major editing software:\s*(.*)/i);
    const stylesMatch = text.match(/Recommended Editing Styles:\s*(.*)/i);

    let mainConcept = text;
    let softwareText = '';
    let stylesText = '';

    if (softwareMatch) {
      mainConcept = text.substring(0, softwareMatch.index).trim();
      if (stylesMatch && stylesMatch.index > softwareMatch.index) {
        softwareText = text.substring(softwareMatch.index + 'How to perform in major editing software:'.length, stylesMatch.index).trim();
        stylesText = text.substring(stylesMatch.index + 'Recommended Editing Styles:'.length).trim();
      } else {
        softwareText = text.substring(softwareMatch.index + 'How to perform in major editing software:'.length).trim();
      }
    } else if (stylesMatch) {
      mainConcept = text.substring(0, stylesMatch.index).trim();
      stylesText = text.substring(stylesMatch.index + 'Recommended Editing Styles:'.length).trim();
    }

    // Split software steps into individual software cards
    // e.g. "- Premiere Pro: ... - DaVinci Resolve: ..."
    const softwareList = [];
    if (softwareText) {
      const swParts = softwareText.split(/(?=-\s*[A-Za-z0-9\s]+:|\b(?:Premiere Pro|DaVinci Resolve|CapCut|Final Cut Pro|Avid Media Composer|VEGAS Pro|After Effects|Filmora):)/gi);
      swParts.forEach(part => {
        const cleaned = part.replace(/^-\s*/, '').trim();
        if (cleaned) {
          const colonIdx = cleaned.indexOf(':');
          if (colonIdx !== -1) {
            const name = cleaned.substring(0, colonIdx).trim();
            const instruction = cleaned.substring(colonIdx + 1).trim();
            softwareList.push({ name, instruction });
          } else {
            softwareList.push({ name: 'NLE Step', instruction: cleaned });
          }
        }
      });
    }

    // Format main concept fields if present (Concept, Category, Definition, Use Case)
    const conceptFields = [];
    const keywords = ['Concept:', 'Category:', 'Definition:', 'Use Case:', 'Why It Works:', 'Rationale:'];
    
    let currentMain = mainConcept;
    keywords.forEach(kw => {
      if (currentMain.includes(kw)) {
        currentMain = currentMain.replaceAll(kw, `\n\n**${kw}**`);
      }
    });

    return {
      conceptText: currentMain.trim(),
      softwareList,
      stylesText
    };
  };

  const { conceptText, softwareList, stylesText } = parseSections(rawText);

  // Render keyboard shortcut badges in text (e.g., Ctrl/Cmd + K)
  const renderFormattedInstruction = (instruction) => {
    const shortcutRegex = /(Ctrl\/Cmd \+ [A-Z0-9]+|Cmd \+ [A-Z0-9]+|Ctrl \+ [A-Z0-9]+|Trim Tool \([A-Z]\)|Blade Tool \([A-Z]\)|Press [A-Z])/gi;
    const parts = instruction.split(shortcutRegex);

    return parts.map((part, idx) => {
      if (shortcutRegex.test(part)) {
        return (
          <kbd key={idx} className="px-1.5 py-0.5 rounded bg-cinema-950 border border-cinema-700 text-amber-400 font-mono text-[11px] font-semibold mx-1">
            {part}
          </kbd>
        );
      }
      return <span key={idx}>{part}</span>;
    });
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* 1. MAIN EDITORIAL RATIONALE & CONCEPT */}
      <div className="space-y-3 leading-relaxed text-cinema-100 text-sm">
        {conceptText.split('\n\n').map((paragraph, idx) => {
          if (paragraph.startsWith('**') && paragraph.includes('**')) {
            const colonIndex = paragraph.indexOf('**', 2);
            const title = paragraph.substring(2, colonIndex).replace(':', '');
            const body = paragraph.substring(colonIndex + 2).trim();

            return (
              <div key={idx} className="bg-cinema-950/60 p-4 rounded-xl border border-cinema-800/80 space-y-1">
                <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider block font-sans">
                  {title}
                </span>
                <p className="text-cinema-200 leading-relaxed font-sans">{body}</p>
              </div>
            );
          }

          return (
            <p key={idx} className="text-cinema-200 leading-relaxed">
              {paragraph}
            </p>
          );
        })}
      </div>

      {/* 2. NLE EXECUTION CARDS (If software steps detected) */}
      {softwareList.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 border-t border-cinema-800/80 pt-4">
            <Monitor className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-semibold text-cinema-200 uppercase tracking-wider font-sans">
              NLE SOFTWARE EXECUTION STEPS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {softwareList.map((sw, idx) => (
              <div key={idx} className="bg-cinema-950 p-4 rounded-xl border border-cinema-800/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cinema-100 font-sans">
                    {sw.name}
                  </span>
                  <span className="text-[10px] font-mono text-cinema-500 uppercase">Step #{idx + 1}</span>
                </div>
                <p className="text-xs text-cinema-300 leading-relaxed">
                  {renderFormattedInstruction(sw.instruction)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. RECOMMENDED STYLES & ATMOSPHERE */}
      {stylesText && (
        <div className="bg-cinema-950/80 p-4 rounded-xl border border-cinema-800/80 space-y-2 pt-3">
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block font-sans">
            RECOMMENDED EDITING STYLES
          </span>
          <p className="text-xs text-cinema-300 leading-relaxed font-sans">
            {stylesText}
          </p>
        </div>
      )}

    </div>
  );
}
