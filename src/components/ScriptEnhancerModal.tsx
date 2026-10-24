import React, { useState } from 'react';
import { Sparkles, Wand2, ArrowRight, Check, X, Languages, Film, Zap, RefreshCw } from 'lucide-react';
import { getApiUrl } from '../config';

interface ScriptEnhancerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentText: string;
  onApply: (enhancedText: string) => void;
}

export const ScriptEnhancerModal: React.FC<ScriptEnhancerModalProps> = ({
  isOpen,
  onClose,
  currentText,
  onApply,
}) => {
  const [selectedMode, setSelectedMode] = useState<
    'add-vocal-bursts' | 'to-nepali' | 'to-hindi' | 'to-hinglish' | 'to-english' | 'dramatic-kahani' | 'viral-hook'
  >('add-vocal-bursts');
  const [isLoading, setIsLoading] = useState(false);
  const [resultText, setResultText] = useState('');
  const [explanation, setExplanation] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleEnhance = async (mode = selectedMode) => {
    if (!currentText.trim()) {
      setError('Please enter some text in the script editor first');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(getApiUrl('/api/enhance-script'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: currentText,
          mode,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to enhance script');
      }

      setResultText(data.enhancedText || '');
      setExplanation(data.notes || 'Script successfully optimized for realistic voice synthesis');
    } catch (err: any) {
      setError(err.message || 'Something went wrong while enhancing the script');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (resultText) {
      onApply(resultText);
      onClose();
    }
  };

  const MODES = [
    {
      id: 'to-nepali' as const,
      title: 'Convert to Natural Nepali',
      desc: 'Translates and adapts into fluent, authentic spoken Nepali Devanagari',
      icon: <Languages className="w-4 h-4 text-rose-400" />,
    },
    {
      id: 'add-vocal-bursts' as const,
      title: 'Humanizer: Auto-Add Breaths & Emotion',
      desc: 'Inserts natural <breath>, <laugh>, and pauses at organic rhythm points',
      icon: <Sparkles className="w-4 h-4 text-purple-400" />,
    },
    {
      id: 'to-hindi' as const,
      title: 'Convert to Natural Hindi',
      desc: 'Translates and adapts into rich, natural spoken Hindi Devanagari',
      icon: <Languages className="w-4 h-4 text-emerald-400" />,
    },
    {
      id: 'to-hinglish' as const,
      title: 'Convert to Urban Hinglish',
      desc: 'Converts to modern colloquial Hinglish (Delhi/Mumbai creator slang)',
      icon: <Zap className="w-4 h-4 text-amber-400" />,
    },
    {
      id: 'to-english' as const,
      title: 'Convert to Fluent English',
      desc: 'Polishes into articulate English narration with natural rhythm',
      icon: <Languages className="w-4 h-4 text-blue-400" />,
    },
    {
      id: 'dramatic-kahani' as const,
      title: 'Dramatic Kahani / Movie Trailer Rewrite',
      desc: 'Suspenseful narrative prose with cinematic micro-pauses',
      icon: <Film className="w-4 h-4 text-rose-400" />,
    },
    {
      id: 'viral-hook' as const,
      title: 'Viral 3-Second Reel / Short Hook',
      desc: 'Rewrites opening to grab viewers instantly with high retention',
      icon: <Wand2 className="w-4 h-4 text-cyan-400" />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">AI Script Director & Humanizer</h3>
              <p className="text-xs text-zinc-400">Polish tone, inject breath pauses, or adapt between Hindi & Hinglish</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Action Modes Selector */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2.5">
              Choose Enhancement Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setSelectedMode(m.id);
                    handleEnhance(m.id);
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                    selectedMode === m.id
                      ? 'bg-purple-950/30 border-purple-500 text-white ring-1 ring-purple-500/50 shadow-md shadow-purple-950/20'
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-zinc-950 shrink-0 border border-zinc-800">
                    {m.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white leading-snug">{m.title}</div>
                    <div className="text-[11px] text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                      {m.desc}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Comparison / Result Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Input Script */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400 flex items-center justify-between">
                <span>Original Script</span>
                <span className="text-[11px] text-zinc-500">{currentText.length} chars</span>
              </label>
              <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-300 font-mono h-40 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                {currentText || <span className="text-zinc-600 italic">No text provided...</span>}
              </div>
            </div>

            {/* Output Enhanced Script */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-purple-300 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  Enhanced Output
                </span>
                {resultText && (
                  <span className="text-[11px] text-purple-400/80">{resultText.length} chars</span>
                )}
              </label>
              <div className="relative p-3.5 rounded-xl bg-purple-950/20 border border-purple-900/40 text-xs text-purple-100 font-mono h-40 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                {isLoading ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/80 backdrop-blur-sm">
                    <RefreshCw className="w-6 h-6 text-purple-400 animate-spin mb-2" />
                    <span className="text-xs text-zinc-400 font-sans">Directing & Humanizing Script...</span>
                  </div>
                ) : resultText ? (
                  resultText
                ) : (
                  <span className="text-zinc-500 italic font-sans">
                    Click any enhancement mode above to preview results...
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-red-950/50 border border-red-800 text-xs text-red-300">
              {error}
            </div>
          )}

          {/* Explanation note */}
          {explanation && (
            <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-400">
              <span className="font-semibold text-purple-300">Director Note:</span> {explanation}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-zinc-800/80 flex items-center justify-between bg-zinc-900/50">
          <button
            type="button"
            onClick={() => handleEnhance(selectedMode)}
            disabled={isLoading || !currentText.trim()}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-300 bg-zinc-800 hover:bg-zinc-700 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Regenerate
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={!resultText || isLoading}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="w-4 h-4" />
              Apply to Script
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
