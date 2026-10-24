import React from 'react';
import { CharacterPreset, LanguageAccent } from '../types';
import { Check, Volume2, User } from 'lucide-react';

interface CharacterCardProps {
  character: CharacterPreset;
  isSelected: boolean;
  onSelect: (character: CharacterPreset) => void;
  onPlaySample: (character: CharacterPreset) => void;
  isPlayingSample: boolean;
  selectedAccent: LanguageAccent;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  isSelected,
  onSelect,
  onPlaySample,
  isPlayingSample,
}) => {
  return (
    <div
      onClick={() => onSelect(character)}
      className={`group relative rounded-2xl p-4 transition-all duration-200 cursor-pointer text-left border ${
        isSelected
          ? 'bg-gradient-to-b from-purple-950/40 via-zinc-900 to-zinc-950 border-purple-500 shadow-lg shadow-purple-900/30 ring-1 ring-purple-500/50'
          : 'bg-zinc-900/80 hover:bg-zinc-850 border-zinc-800 hover:border-zinc-700'
      }`}
    >
      {/* Selection pill */}
      {isSelected && (
        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-600/50">
          <Check className="w-3.5 h-3.5 stroke-[3]" />
        </div>
      )}

      {/* Top Row: Avatar + Name + Badges */}
      <div className="flex items-start gap-3.5">
        <div
          className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${character.avatarGradient} flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0 border border-white/10`}
        >
          {character.name.charAt(0)}
        </div>

        <div className="flex-1 min-w-0 pr-6">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-bold text-white text-base truncate tracking-tight">{character.name}</h4>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
              {character.languageCategory}
            </span>
          </div>
          <p className="text-xs text-zinc-400 font-medium truncate mt-0.5">{character.title}</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-zinc-400 line-clamp-2 mt-3 leading-relaxed">
        {character.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mt-3">
        {character.tags.slice(0, 3).map((tag, i) => (
          <span
            key={i}
            className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-zinc-800/80 text-zinc-300 border border-zinc-700/60"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Bottom Bar: Sample Line Playback & Meta */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-800/70">
        <div className="flex items-center gap-1 text-[11px] text-zinc-500 font-medium">
          <User className="w-3 h-3" />
          <span className="capitalize">{character.gender}</span> • <span>{character.age}y</span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onPlaySample(character);
          }}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
            isPlayingSample
              ? 'bg-purple-600 text-white animate-pulse shadow-md shadow-purple-600/30'
              : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white'
          }`}
        >
          <Volume2 className="w-3.5 h-3.5" />
          {isPlayingSample ? 'Playing...' : 'Voice Sample'}
        </button>
      </div>
    </div>
  );
};
