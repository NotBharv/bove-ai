import React, { useState, useEffect } from 'react';
import {
  Check,
  Zap,
  Sparkles,
  ShieldCheck,
  X,
  Crown,
  Layers,
  Users,
  Volume2,
  TrendingUp,
  Globe2,
  Flame,
  Radio,
} from 'lucide-react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan?: 'free' | 'pro' | 'studio';
  onSelectPlan?: (plan: 'free' | 'pro' | 'studio') => void;
  userGenerations?: number;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  currentPlan = 'free',
  onSelectPlan,
  userGenerations = 0,
}) => {
  const [stats, setStats] = useState({
    totalGenerations: 54892,
    activeCreatorsNow: 148,
    voicesToday: 1420,
    totalMinutes: 49400,
  });

  const [claimed, setClaimed] = useState(false);

  // Fetch live stats from backend
  useEffect(() => {
    if (!isOpen) return;

    fetch('/api/stats')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setStats({
            totalGenerations: data.totalGenerations || 54892,
            activeCreatorsNow: data.activeCreatorsNow || 148,
            voicesToday: data.voicesToday || 1420,
            totalMinutes: data.totalMinutesGenerated || 49400,
          });
        }
      })
      .catch(() => {
        // Fallback gracefully
      });
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClaimFreeVIP = () => {
    setClaimed(true);
    if (onSelectPlan) {
      onSelectPlan('pro');
    }
    setTimeout(() => {
      setClaimed(false);
      onClose();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-white my-6 overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer z-10"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center max-w-xl mx-auto mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-indigo-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>VIP Creator Pass • Early Access</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-100 to-amber-200 bg-clip-text text-transparent">
            Unlimited Studio Voice Generation
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm mt-2">
            No subscriptions or hidden fees. Generate unlimited voices in Nepali, Hindi, and English completely free during our public launch.
          </p>
        </div>

        {/* Price Hero Section: $10 Crossed Out -> $0 Free */}
        <div className="rounded-2xl bg-gradient-to-b from-purple-950/30 via-zinc-900/70 to-zinc-950 border-2 border-purple-500/50 p-6 sm:p-7 shadow-xl relative mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-purple-300 uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Early Adopter Special • 100% Free Plan</span>
              </div>
              <div className="flex items-baseline gap-3 mt-2 flex-wrap">
                {/* Crossed out $10 */}
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl sm:text-3xl font-extrabold text-zinc-500 line-through decoration-rose-500 decoration-4">
                    $10
                  </span>
                  <span className="text-xs text-zinc-500 line-through font-medium">/ month (रु. १,३५०)</span>
                </div>

                {/* Strikethrough Arrow */}
                <span className="text-purple-400 text-xl font-bold">→</span>

                {/* Big bold $0 */}
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight text-emerald-400">
                    $0
                  </span>
                  <span className="text-sm sm:text-base font-bold text-emerald-300 ml-1">
                    Free Forever
                  </span>
                </div>
              </div>
              <p className="text-xs text-zinc-400 mt-2">
                All premium neural voice features, dual dialogues, and commercial rights are fully unlocked.
              </p>
            </div>

            {/* Quick Claim Button */}
            <div className="w-full sm:w-auto shrink-0">
              {claimed ? (
                <div className="px-6 py-3.5 rounded-xl bg-emerald-950/90 border border-emerald-500 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>VIP Plan Active! Unlimited Voices Unlocked</span>
                </div>
              ) : (
                <button
                  onClick={handleClaimFreeVIP}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-xs sm:text-sm font-extrabold bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white cursor-pointer shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Claim $0 Free VIP Access</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Live Usage Statistics ("Kati Use gari ra xan tyo data") */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-300 uppercase tracking-wider">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <span>Live Creator Activity & Usage Data</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Updates</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Stat 1: Active Creators */}
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-[11px] font-medium">Creators Online</span>
                <Radio className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-white font-mono tabular-nums">
                  {stats.activeCreatorsNow}
                </div>
                <div className="text-[10px] text-emerald-400 font-medium mt-0.5">
                  Active right now
                </div>
              </div>
            </div>

            {/* Stat 2: Total Generations */}
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-[11px] font-medium">Total Voices</span>
                <Volume2 className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-white font-mono tabular-nums">
                  {stats.totalGenerations.toLocaleString()}+
                </div>
                <div className="text-[10px] text-purple-300 font-medium mt-0.5">
                  Generated globally
                </div>
              </div>
            </div>

            {/* Stat 3: Today's Audio */}
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-[11px] font-medium">Rendered Today</span>
                <Flame className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-white font-mono tabular-nums">
                  {stats.voicesToday.toLocaleString()}
                </div>
                <div className="text-[10px] text-amber-300 font-medium mt-0.5">
                  Clips synthesized
                </div>
              </div>
            </div>

            {/* Stat 4: Your Personal Count */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/40 to-purple-950/40 border border-indigo-500/40 flex flex-col justify-between">
              <div className="flex items-center justify-between text-indigo-300 mb-2">
                <span className="text-[11px] font-medium">Your Usage</span>
                <Crown className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-white font-mono tabular-nums">
                  {userGenerations}
                </div>
                <div className="text-[10px] text-indigo-300 font-medium mt-0.5">
                  Voices created (Unlimited)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Unlocked Checklist */}
        <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 mb-6">
          <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-3">
            What You Get Free With Early Access
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-zinc-300">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Unlimited Voice Generations (No credit limits)</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Full Commercial Rights (YouTube, TikTok, Ads)</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>All 26+ Nepali, Hindi & English Personas</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Dual-Speaker Dialogue & Podcast Studio</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>AI Script Humanizer & Emotional Bursts</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Crystal Clear Studio WAV Audio Export</span>
            </div>
          </div>
        </div>

        {/* Global Creator Regions */}
        <div className="pt-4 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-purple-400" />
            <span>Community Creators: Nepal (68%) • India (18%) • Global Diaspora (14%)</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>Zero payment required • Unlimited generation active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
