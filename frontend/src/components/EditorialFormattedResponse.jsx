import React from 'react';
import { Monitor } from 'lucide-react';

export default function EditorialFormattedResponse({ rawText, userSkill }) {
  if (!rawText) return null;

  // Helper to parse key sections from raw string response
  const parseSections = (text) => {
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

  const renderFormattedInstruction = (instruction) => {
    const shortcutRegex = /(Ctrl\/Cmd \+ [A-Z0-9]+|Cmd \+ [A-Z0-9]+|Ctrl \+ [A-Z0-9]+|Trim Tool \([A-Z]\)|Blade Tool \([A-Z]\)|Press [A-Z])/gi;
    const parts = instruction.split(shortcutRegex);

    return parts.map((part, idx) => {
      if (shortcutRegex.test(part)) {
        return (
          <kbd key={idx} className="px-2.5 py-1 rounded-md bg-[#25283c] border border-amber-500/40 text-amber-300 font-mono text-xs font-bold mx-1 shadow-sm inline-block">
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
      <div className="space-y-4 leading-relaxed text-slate-100 text-base">
        {conceptText.split('\n\n').map((paragraph, idx) => {
          if (paragraph.startsWith('**') && paragraph.includes('**')) {
            const colonIndex = paragraph.indexOf('**', 2);
            const title = paragraph.substring(2, colonIndex).replace(':', '');
            const body = paragraph.substring(colonIndex + 2).trim();

            return (
              <div key={idx} className="bg-[#181a28] p-5 rounded-2xl border border-[#292c3e] space-y-1.5 shadow-md">
                <span className="text-xs md:text-sm font-bold text-amber-400 uppercase tracking-wider block font-sans">
                  {title}
                </span>
                <p className="text-slate-100 leading-relaxed font-sans text-base">{body}</p>
              </div>
            );
          }

          return (
            <p key={idx} className="text-slate-100 leading-relaxed text-base">
              {paragraph}
            </p>
          );
        })}
      </div>

      {/* 2. NLE EXECUTION CARDS */}
      {softwareList.length > 0 && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2.5 border-t border-[#252838] pt-5">
            <Monitor className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-bold text-slate-200 uppercase tracking-wider font-sans">
              NLE SOFTWARE EXECUTION STEPS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {softwareList.map((sw, idx) => (
              <div key={idx} className="bg-[#181a28] p-5 rounded-2xl border border-[#292c3e] hover:border-amber-500/40 space-y-2.5 shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-white font-sans">
                    {sw.name}
                  </span>
                  <span className="text-xs font-mono text-amber-400 font-semibold">Step #{idx + 1}</span>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed font-sans">
                  {renderFormattedInstruction(sw.instruction)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. RECOMMENDED STYLES & ATMOSPHERE */}
      {stylesText && (
        <div className="bg-[#181a28] p-5 rounded-2xl border border-[#292c3e] space-y-2 pt-4 shadow-md">
          <span className="text-sm font-bold text-amber-400 uppercase tracking-wider block font-sans">
            RECOMMENDED EDITING STYLES
          </span>
          <p className="text-sm text-slate-200 leading-relaxed font-sans">
            {stylesText}
          </p>
        </div>
      )}

    </div>
  );
}
