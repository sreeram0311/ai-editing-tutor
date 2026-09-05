import React from 'react';
import { Monitor, Sparkles } from 'lucide-react';

export default function EditorialFormattedResponse({ rawText, userSkill }) {
  if (!rawText) return null;

  // Known NLE Software Titles
  const knownSoftware = [
    'Premiere Pro',
    'DaVinci Resolve',
    'CapCut',
    'Final Cut Pro',
    'Avid Media Composer',
    'VEGAS Pro',
    'After Effects',
    'Filmora'
  ];

  // Helper to parse key sections from raw string response without duplication
  const parseSections = (text) => {
    // 1. Extract Software Execution Steps cleanly
    const softwareList = [];
    const seenSoftware = new Set();

    knownSoftware.forEach(swName => {
      const regex = new RegExp(`(?:-|\\*|•)?\\s*${swName}:\\s*([^\\n\\r-]+)`, 'i');
      const match = text.match(regex);
      if (match && match[1] && !seenSoftware.has(swName)) {
        // Strip out any trailing concept markers if present
        let instruction = match[1].trim();
        const conceptIdx = instruction.search(/\b(?:Concept|Category|Definition|Use Case|How to perform|Recommended):/i);
        if (conceptIdx !== -1) {
          instruction = instruction.substring(0, conceptIdx).trim();
        }
        if (instruction) {
          seenSoftware.add(swName);
          softwareList.push({ name: swName, instruction });
        }
      }
    });

    // 2. Extract Recommended Editing Styles if present
    let stylesText = '';
    const stylesMatch = text.match(/Recommended Editing Styles:\s*(.*)/i);
    if (stylesMatch && stylesMatch[1]) {
      stylesText = stylesMatch[1].trim();
    }

    // 3. Clean Main Concept Text (Remove software execution lines and duplicate concept blocks)
    let mainConcept = text;

    // Cut off at first occurrence of "How to perform in major editing software:"
    const howToMatch = mainConcept.match(/How to perform in major editing software:/i);
    if (howToMatch) {
      mainConcept = mainConcept.substring(0, howToMatch.index).trim();
    }

    // Format Markdown bold syntax keywords for clear visual rendering
    const keywords = ['Concept:', 'Category:', 'Definition:', 'Use Case:', 'Why It Works:', 'Rationale:'];
    keywords.forEach(kw => {
      if (mainConcept.includes(kw) && !mainConcept.includes(`**${kw}**`)) {
        mainConcept = mainConcept.replaceAll(kw, `\n\n**${kw}**`);
      }
    });

    return {
      conceptText: mainConcept.trim(),
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
          <kbd key={idx} className="px-3 py-1 rounded-lg bg-[#25283c] border border-amber-500/40 text-amber-300 font-mono text-xs md:text-sm font-bold mx-1 shadow-sm inline-block">
            {part}
          </kbd>
        );
      }
      return <span key={idx}>{part}</span>;
    });
  };

  const renderConceptParagraph = (paragraph, idx) => {
    if (paragraph.includes('**')) {
      const parts = paragraph.split(/(\*\*[^*]+\*\*)/g);
      return (
        <div key={idx} className="bg-[#181a28] p-6 rounded-2xl border border-[#292c3e] space-y-2 shadow-md">
          <div className="text-slate-100 leading-relaxed font-sans text-base md:text-lg">
            {parts.map((part, pIdx) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                const label = part.slice(2, -2).replace(':', '');
                return (
                  <span key={pIdx} className="font-bold text-amber-400 mr-2 block text-sm uppercase tracking-wider mb-1">
                    {label}
                  </span>
                );
              }
              return <span key={pIdx}>{part}</span>;
            })}
          </div>
        </div>
      );
    }

    return (
      <p key={idx} className="text-slate-100 leading-relaxed text-base md:text-lg font-sans">
        {paragraph}
      </p>
    );
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* 1. MAIN EDITORIAL RATIONALE & CONCEPT */}
      <div className="space-y-4 leading-relaxed text-slate-100 text-base md:text-lg">
        {conceptText.split('\n\n').map((paragraph, idx) => renderConceptParagraph(paragraph, idx))}
      </div>

      {/* 2. UNIQUE NLE EXECUTION CARDS */}
      {softwareList.length > 0 && (
        <div className="space-y-4 pt-3">
          <div className="flex items-center gap-2.5 border-t border-[#252838] pt-6">
            <Monitor className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-bold text-slate-200 uppercase tracking-wider font-sans">
              NLE SOFTWARE EXECUTION STEPS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {softwareList.map((sw, idx) => (
              <div key={idx} className="bg-[#181a28] p-6 rounded-2xl border border-[#292c3e] hover:border-amber-500/40 space-y-3 shadow-md transition-all">
                <div className="flex items-center justify-between border-b border-[#252838] pb-2.5">
                  <span className="text-lg font-bold text-white font-sans">
                    {sw.name}
                  </span>
                </div>
                <p className="text-base text-slate-100 leading-relaxed font-sans pt-1">
                  {renderFormattedInstruction(sw.instruction)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. RECOMMENDED STYLES & ATMOSPHERE */}
      {stylesText && (
        <div className="bg-[#181a28] p-6 rounded-2xl border border-[#292c3e] space-y-2 pt-4 shadow-md">
          <span className="text-sm font-bold text-amber-400 uppercase tracking-wider block font-sans">
            RECOMMENDED EDITING STYLES
          </span>
          <p className="text-base text-slate-100 leading-relaxed font-sans">
            {stylesText}
          </p>
        </div>
      )}

    </div>
  );
}
