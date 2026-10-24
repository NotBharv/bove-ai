import React from 'react';
import { EmotionType, EmotionIntensity, LanguageAccent } from '../types';
import {
  Smile,
  Sparkles,
  Flame,
  VolumeX,
  Zap,
  Heart,
  Compass,
  Frown,
  Laugh,
  MinusCircle,
  Plus,
  Sliders,
} from 'lucide-react';

interface EmotionControlsProps {
  emotion: EmotionType;
  onEmotionChange: (emotion: EmotionType) => void;
  intensity: EmotionIntensity;
  onIntensityChange: (intensity: EmotionIntensity) => void;
  accent: LanguageAccent;
  onAccentChange: (accent: LanguageAccent) => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  pitch: 'deep' | 'medium' | 'high';
  onPitchChange: (pitch: 'deep' | 'medium' | 'high') => void;
  onInsertTag: (tag: string) => void;
}

const EMOTION_ITEMS: { id: EmotionType; label: string; icon: React.ReactNode; hint: string }[] = [
  { id: 'neutral', label: 'Natural / Neutral', icon: <MinusCircle className="w-4 h-4" />, hint: 'Balanced conversational tone' },
  { id: 'cheerful', label: 'Cheerful & Upbeat', icon: <Smile className="w-4 h-4" />, hint: 'Warm, smiling, bright delivery' },
  { id: 'dramatic', label: 'Dramatic Storyteller', icon: <Sparkles className="w-4 h-4" />, hint: 'Deeply expressive, suspenseful' },
  { id: 'whisper', label: 'Whisper / Soft', icon: <VolumeX className="w-4 h-4" />, hint: 'Intimate, quiet, ASMR-like' },
  { id: 'energetic', label: 'Radio RJ / Energetic', icon: <Zap className="w-4 h-4" />, hint: 'High-energy, fast, punchy' },
  { id: 'calm', label: 'Calm & Meditative', icon: <Heart className="w-4 h-4" />, hint: 'Peaceful, slow, zen relaxation' },
  { id: 'intense', label: 'Intense & Urgent', icon: <Flame className="w-4 h-4" />, hint: 'Strong, powerful, urgent' },
  { id: 'inspirational', label: 'Motivational', icon: <Compass className="w-4 h-4" />, hint: 'Inspiring, rising confidence' },
  { id: 'sarcastic', label: 'Playful & Witty', icon: <Laugh className="w-4 h-4" />, hint: 'Cheeky, playful sarcasm' },
  { id: 'sad', label: 'Melancholic / Sad', icon: <Frown className="w-4 h-4" />, hint: 'Sorrowful, tender, emotional' },
];

const VOCAL_BURSTS = [
  { tag: '<breath> ', label: 'Breath', hint: 'Natural breath pause' },
  { tag: '<laugh> ', label: 'Laugh', hint: 'Chuckle / light laughter' },
  { tag: '<gasp> ', label: 'Gasp', hint: 'Surprised gasp' },
  { tag: '<sigh> ', label: 'Sigh', hint: 'Relieved / deep sigh' },
  { tag: '|yeah| ', label: 'Yeah', hint: 'Conversational agreement' },
  { tag: '|mhm| ', label: 'Mhm', hint: 'Thoughtful hum' },
  { tag: '... ', label: 'Pause (...)', hint: '0.5s dramatic pause' },
];

export const EmotionControls: React.FC<EmotionControlsProps> = ({
  emotion,
  onEmotionChange,
  intensity,
  onIntensityChange,
  accent,
  onAccentChange,
  speed,
  onSpeedChange,
  pitch,
  onPitchChange,
  onInsertTag,
}) => {
  return (
    <div className="space-y-5 bg-zinc-900/90 rounded-2xl border border-zinc-800 p-5">
      {/* Language / Accent Selector */}
      <div>
        <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2.5">
          1. Accent & Language Dialect
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {(
            [
              { id: 'Nepali', label: 'Nepali', desc: 'Authentic Nepali Tone' },
              { id: 'Hindi', label: 'Hindi', desc: 'Devanagari Cadence' },
              { id: 'Hinglish', label: 'Urban Hinglish', desc: 'Modern Creator Style' },
              { id: 'Indian-English', label: 'Indian English', desc: 'Authentic Accent' },
              { id: 'US-English', label: 'US English', desc: 'Standard American' },
              { id: 'UK-English', label: 'UK English', desc: 'Crisp British' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onAccentChange(item.id)}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                accent === item.id
                  ? 'bg-purple-600/20 border-purple-500 text-white shadow-sm ring-1 ring-purple-500/40'
                  : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
              }`}
            >
              <div className="text-xs font-bold leading-tight truncate">{item.label}</div>
              <div className="text-[10px] text-zinc-500 truncate mt-0.5">{item.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Emotion Matrix */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
            2. Delivery Emotion
          </label>
          <span className="text-xs text-purple-400 font-medium capitalize">
            Active: {emotion}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {EMOTION_ITEMS.map((item) => {
            const isSelected = emotion === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onEmotionChange(item.id)}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400 shadow-md shadow-purple-900/40'
                    : 'bg-zinc-950/60 border-zinc-800/90 text-zinc-300 hover:bg-zinc-800/80 hover:text-white'
                }`}
                title={item.hint}
              >
                <div className={`p-1 rounded-lg ${isSelected ? 'bg-white/20' : 'bg-zinc-800 text-purple-400'}`}>
                  {item.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold truncate">{item.label}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Emotion Intensity & Speed & Pitch */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-zinc-800/80">
        {/* Emotion Intensity */}
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-2">
            Emotion Intensity
          </label>
          <div className="grid grid-cols-4 gap-1.5 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
            {(['subtle', 'moderate', 'high', 'extreme'] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => onIntensityChange(lvl)}
                className={`py-1 text-[11px] font-semibold rounded-lg capitalize transition-all cursor-pointer ${
                  intensity === lvl
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Cadence / Speaking Speed */}
        <div>
          <div className="flex items-center justify-between text-xs font-medium text-zinc-400 mb-2">
            <span>Pace / Speed</span>
            <span className="text-purple-400 font-mono font-semibold">{speed.toFixed(2)}x</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={0.8}
              max={1.3}
              step={0.05}
              value={speed}
              onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>
          <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
            <span>0.8x (Measured)</span>
            <span>1.0x (Normal)</span>
            <span>1.3x (Fast RJ)</span>
          </div>
        </div>

        {/* Vocal Pitch / Timbre */}
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-2">
            Vocal Timbre / Pitch
          </label>
          <div className="grid grid-cols-3 gap-1.5 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
            {(
              [
                { id: 'deep', label: 'Deep' },
                { id: 'medium', label: 'Balanced' },
                { id: 'high', label: 'Bright' },
              ] as const
            ).map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onPitchChange(p.id)}
                className={`py-1 text-[11px] font-semibold rounded-lg capitalize transition-all cursor-pointer ${
                  pitch === p.id
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Vocal Bursts & Breathing Tags (10x ElevenLabs Feature) */}
      <div className="pt-3 border-t border-zinc-800/80">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-xs font-semibold text-zinc-300">
              Vocal Bursts & Humanizer Tags
            </span>
            <span className="text-[10px] text-zinc-500">
              (Inserts directly into script for 100% human-like pauses)
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {VOCAL_BURSTS.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onInsertTag(item.tag)}
              title={item.hint}
              className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-zinc-950 hover:bg-purple-950/50 text-zinc-300 hover:text-purple-300 border border-zinc-800 hover:border-purple-500/50 transition-all flex items-center gap-1 cursor-pointer active:scale-95"
            >
              <Plus className="w-3 h-3 text-purple-400" />
              <span>{item.tag.trim()}</span>
              <span className="text-[10px] text-zinc-500 font-sans">({item.label})</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
