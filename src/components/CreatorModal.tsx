import React, { useState } from 'react';
import { User, Mail, ShieldCheck, Sparkles, X, Check, Copy, ExternalLink, Award, Globe } from 'lucide-react';

interface CreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatorModal: React.FC<CreatorModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('contact@boveai.studio');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Top Decorative Banner */}
        <div className="h-28 bg-gradient-to-r from-purple-900/60 via-indigo-900/40 to-zinc-900 border-b border-zinc-800/80 p-4 flex justify-end items-start relative">
          <div className="absolute top-4 left-6 text-xs font-semibold text-purple-300 uppercase tracking-widest flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-purple-400" /> Bove AI Voice Architecture
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Avatar & Info */}
        <div className="px-6 pb-6 relative -mt-12 space-y-5">
          <div className="flex items-end justify-between">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 border-4 border-zinc-950 flex items-center justify-center text-white text-2xl font-black shadow-xl">
              BA
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-purple-400" />
                Audio AI Studio
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Bove AI Studio</h3>
            <p className="text-xs text-purple-400 font-medium mt-0.5">Next-Gen Multilingual Speech Engine</p>
            <p className="text-xs text-zinc-400 mt-2.5 leading-relaxed">
              Dedicated to pioneering next-generation neural speech synthesis for authentic Nepali, Hindi, and English voices. Empowering creators, storytellers, and businesses worldwide with human-like vocal emotion and zero-friction studio tools.
            </p>
          </div>

          {/* Highlights */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <div className="text-[11px] text-zinc-500 font-medium">Flagship Platform</div>
              <div className="text-xs font-bold text-white mt-0.5">Bove AI Studio</div>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <div className="text-[11px] text-zinc-500 font-medium">Core Specialization</div>
              <div className="text-xs font-bold text-white mt-0.5">Nepali & Multilingual TTS</div>
            </div>
          </div>

          {/* Contact & Verification Info */}
          <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-300 shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] text-zinc-500 font-medium">Official Contact</div>
                <div className="text-xs font-semibold text-zinc-200 truncate">contact@boveai.studio</div>
              </div>
            </div>

            <button
              onClick={handleCopyEmail}
              className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-200 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Footer note */}
          <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500">
            <span>© 2026 Bove AI. All rights reserved.</span>
            <span className="text-zinc-400">Engineered with Precision</span>
          </div>
        </div>
      </div>
    </div>
  );
};
