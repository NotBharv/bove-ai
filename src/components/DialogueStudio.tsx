import React from 'react';
import { CHARACTERS } from '../data/characters';
import { DialogueSegment, GeminiVoiceName } from '../types';
import { Plus, Trash2, MessageSquare, Volume2, Sparkles, User } from 'lucide-react';

interface DialogueStudioProps {
  segments: DialogueSegment[];
  onSegmentsChange: (segments: DialogueSegment[]) => void;
  speaker1: string;
  onSpeaker1Change: (name: string) => void;
  speaker2: string;
  onSpeaker2Change: (name: string) => void;
  onInsertBurst: (index: number, burst: string) => void;
}

export const DialogueStudio: React.FC<DialogueStudioProps> = ({
  segments,
  onSegmentsChange,
  speaker1,
  onSpeaker1Change,
  speaker2,
  onSpeaker2Change,
  onInsertBurst,
}) => {
  const char1 = CHARACTERS.find((c) => c.name === speaker1) || CHARACTERS[0];
  const char2 = CHARACTERS.find((c) => c.name === speaker2) || CHARACTERS[1];

  const addSegment = (speakerName: string) => {
    const isSp1 = speakerName === speaker1;
    const voiceName: GeminiVoiceName = isSp1 ? char1.voiceName : char2.voiceName;
    const newSegment: DialogueSegment = {
      id: Math.random().toString(36).substring(7),
      speaker: speakerName,
      voiceName,
      accent: isSp1 ? char1.accent : char2.accent,
      emotion: isSp1 ? char1.defaultEmotion : char2.defaultEmotion,
      text: '',
    };
    onSegmentsChange([...segments, newSegment]);
  };

  const updateSegment = (index: number, field: keyof DialogueSegment, value: any) => {
    const next = [...segments];
    next[index] = { ...next[index], [field]: value };
    onSegmentsChange(next);
  };

  const removeSegment = (index: number) => {
    onSegmentsChange(segments.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Speaker Setup Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Speaker 1 */}
        <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
              <User className="w-4 h-4" /> Speaker 1 (Lead)
            </span>
            <span className="text-xs text-zinc-500 font-mono">Voice: {char1.voiceName}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${char1.avatarGradient} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
              {char1.name.charAt(0)}
            </div>
            <div className="flex-1">
              <select
                value={speaker1}
                onChange={(e) => onSpeaker1Change(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white font-medium focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                {CHARACTERS.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name} [{c.languageCategory.toUpperCase()}] - {c.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p className="text-[11px] text-zinc-400">{char1.description}</p>
        </div>

        {/* Speaker 2 */}
        <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <User className="w-4 h-4" /> Speaker 2 (Co-Host / Guest)
            </span>
            <span className="text-xs text-zinc-500 font-mono">Voice: {char2.voiceName}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${char2.avatarGradient} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
              {char2.name.charAt(0)}
            </div>
            <div className="flex-1">
              <select
                value={speaker2}
                onChange={(e) => onSpeaker2Change(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white font-medium focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                {CHARACTERS.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name} [{c.languageCategory.toUpperCase()}] - {c.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p className="text-[11px] text-zinc-400">{char2.description}</p>
        </div>
      </div>

      {/* Screenplay Turn List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-white">Conversation Script Lines</h3>
            <span className="text-xs text-zinc-500">({segments.length} lines)</span>
          </div>
        </div>

        {segments.map((seg, idx) => {
          const isSp1 = seg.speaker === speaker1;
          const activeChar = isSp1 ? char1 : char2;

          return (
            <div
              key={seg.id || idx}
              className={`p-4 rounded-2xl border transition-all ${
                isSp1
                  ? 'bg-zinc-900/90 border-purple-900/40 shadow-sm'
                  : 'bg-zinc-900/90 border-cyan-900/40 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-lg bg-gradient-to-br ${activeChar.avatarGradient} flex items-center justify-center text-white font-bold text-xs`}
                  >
                    {activeChar.name.charAt(0)}
                  </div>
                  <select
                    value={seg.speaker}
                    onChange={(e) => {
                      const newSp = e.target.value;
                      const c = newSp === speaker1 ? char1 : char2;
                      updateSegment(idx, 'speaker', newSp);
                      updateSegment(idx, 'voiceName', c.voiceName);
                    }}
                    className="bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1 text-xs font-bold text-white cursor-pointer"
                  >
                    <option value={speaker1}>{speaker1}</option>
                    <option value={speaker2}>{speaker2}</option>
                  </select>
                  <span className="text-xs text-zinc-500 font-mono">Turn #{idx + 1}</span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Vocal Burst Inserts */}
                  <div className="flex items-center gap-1">
                    {['<breath> ', '<laugh> ', '|yeah| ', '|mhm| '].map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => onInsertBurst(idx, b)}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 cursor-pointer"
                      >
                        +{b.trim()}
                      </button>
                    ))}
                  </div>

                  {segments.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSegment(idx)}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <textarea
                value={seg.text}
                onChange={(e) => updateSegment(idx, 'text', e.target.value)}
                placeholder={`Enter dialogue for ${seg.speaker} in Hindi, Hinglish, or English...`}
                rows={2}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-zinc-200 focus:outline-none focus:border-purple-500 font-sans leading-relaxed resize-y placeholder:text-zinc-600"
              />
            </div>
          );
        })}

        {/* Add Turn Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => addSegment(speaker1)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add line for {speaker1}
          </button>

          <button
            type="button"
            onClick={() => addSegment(speaker2)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add line for {speaker2}
          </button>
        </div>
      </div>
    </div>
  );
};
