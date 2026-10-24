import React, { useState } from 'react';
import { Mic2, History, Wand2, Sparkles, Layers, BookOpen, User, ShieldCheck, Download, Crown, Loader2, Check, FolderArchive } from 'lucide-react';
import { SCRIPT_TEMPLATES, ScriptTemplate } from '../data/templates';
import { downloadSingleZip } from '../utils/downloadZip';

interface NavbarProps {
  activeTab: 'single' | 'dialogue';
  onTabChange: (tab: 'single' | 'dialogue') => void;
  onOpenHistory: () => void;
  historyCount: number;
  onOpenEnhancer: () => void;
  onSelectTemplate: (template: ScriptTemplate) => void;
  onOpenCreator: () => void;
  onOpenSubscription: () => void;
  onOpenDownload?: () => void;
  userGenerations?: number;
  activeCreators?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  onOpenHistory,
  historyCount,
  onOpenEnhancer,
  onSelectTemplate,
  onOpenCreator,
  onOpenSubscription,
  onOpenDownload,
  userGenerations = 0,
  activeCreators = 148,
}) => {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleQuickDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setDownloading(true);
    await downloadSingleZip((state) => {
      if (state === 'downloading') setDownloading(true);
      if (state === 'success') {
        setDownloading(false);
        setDownloaded(true);
        setTimeout(() => setDownloaded(false), 4000);
      }
      if (state === 'error') {
        setDownloading(false);
        if (onOpenDownload) onOpenDownload();
      }
    });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand & Tagline */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-600/30 font-black text-xl">
            B
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-lg tracking-tight bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
                Bove<span className="text-purple-400 font-bold"> AI</span>
              </span>
              <button
                onClick={onOpenSubscription}
                className="px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-all bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25 flex items-center gap-1.5"
                title="View VIP Free Launch Access"
              >
                <span className="line-through decoration-rose-500 text-zinc-400 font-medium">$10</span>
                <span className="text-emerald-400 font-extrabold">$0 FREE</span>
              </button>
            </div>
            <p className="text-[11px] text-zinc-400 hidden sm:block">
              Neural Studio • Nepali, Hindi & English
            </p>
          </div>
        </div>

        {/* Central Studio Mode Tabs */}
        <div className="flex items-center bg-zinc-900 p-1 rounded-xl border border-zinc-800">
          <button
            onClick={() => onTabChange('single')}
            className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'single'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Single Voice</span>
          </button>
          <button
            onClick={() => onTabChange('dialogue')}
            className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'dialogue'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Dual Dialogue</span>
          </button>
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Templates Dropdown */}
          <div className="relative group">
            <button
              type="button"
              className="px-3 py-1.5 rounded-xl text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Scripts</span>
            </button>
            <div className="absolute right-0 top-full mt-2 w-72 p-2 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider px-2 py-1 mb-1">
                Instant Script Templates
              </div>
              <div className="space-y-1">
                {SCRIPT_TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => onSelectTemplate(tmpl)}
                    className="w-full text-left p-2 rounded-xl hover:bg-zinc-900 transition-colors cursor-pointer group/item"
                  >
                    <div className="text-xs font-medium text-white group-hover/item:text-purple-300">
                      {tmpl.title}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-zinc-500 mt-0.5">
                      <span>{tmpl.category}</span> • <span>{tmpl.language}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* AI Script Humanizer button */}
          <button
            onClick={onOpenEnhancer}
            className="px-3 py-1.5 rounded-xl text-xs font-medium bg-purple-950/60 hover:bg-purple-900/60 text-purple-200 border border-purple-800/80 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Wand2 className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">AI Humanizer</span>
          </button>

          {/* History Drawer button */}
          <button
            onClick={onOpenHistory}
            className="relative px-3 py-1.5 rounded-xl text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <History className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">Clips</span>
            {historyCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center">
                {historyCount}
              </span>
            )}
          </button>

          {/* Free VIP / Early Access Button */}
          <button
            onClick={onOpenSubscription}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500/15 via-purple-600/20 to-amber-500/20 hover:from-emerald-500/25 hover:to-amber-500/30 text-white border border-emerald-500/40 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <div className="flex items-center gap-1.5">
              <span className="line-through decoration-rose-500 text-zinc-400 font-semibold">$10</span>
              <span className="text-emerald-400 font-extrabold">$0 FREE</span>
            </div>
            <span className="hidden sm:inline-block text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
              VIP Unlocked
            </span>
          </button>

          {/* Studio Profile Button */}
          <button
            onClick={onOpenCreator}
            title="View Bove Studio Info"
            className="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <User className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden lg:inline">Studio Info</span>
          </button>

          {/* Download ZIP Button & Modal Trigger */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleQuickDownload}
              disabled={downloading}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                downloaded
                  ? 'bg-emerald-600 text-white border border-emerald-400'
                  : downloading
                  ? 'bg-purple-900/80 text-purple-200 border border-purple-500 animate-pulse'
                  : 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/80 hover:border-emerald-500'
              }`}
              title="1-Click Download bove-ai.zip (Single clean ZIP)"
            >
              {downloading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-300" />
                  <span className="hidden sm:inline">Downloading...</span>
                </>
              ) : downloaded ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span className="hidden sm:inline">Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Download ZIP</span>
                  <span className="sm:hidden">ZIP</span>
                </>
              )}
            </button>

            {onOpenDownload && (
              <button
                type="button"
                onClick={onOpenDownload}
                className="p-1.5 rounded-xl text-xs text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-colors cursor-pointer"
                title="Open Download & Export Center"
              >
                <FolderArchive className="w-3.5 h-3.5 text-zinc-400 hover:text-emerald-400" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
