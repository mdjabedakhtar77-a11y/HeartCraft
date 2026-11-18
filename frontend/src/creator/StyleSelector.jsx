import React from 'react';
import { Sparkles, Check } from 'lucide-react';

export default function StyleSelector({ selectedStyle, onSelectStyle, styles = [] }) {
  const defaultStyles = [
    {
      id: 'galaxy',
      name: 'Cosmic Galaxy',
      desc: 'Deep purple void with glowing stars & nebulae',
      gradient: 'from-purple-950 via-indigo-950 to-black',
      accent: '#ec4899',
      border: 'border-purple-500/50'
    },
    {
      id: 'classic-gold',
      name: 'Royal Champagne',
      desc: 'Warm golden luxury with sparkling confetti',
      gradient: 'from-amber-950 via-yellow-950 to-stone-900',
      accent: '#f59e0b',
      border: 'border-amber-500/50'
    },
    {
      id: 'rose-romance',
      name: 'Rose Romance',
      desc: 'Soft crimson glow with floating velvet rose petals',
      gradient: 'from-rose-950 via-pink-950 to-slate-900',
      accent: '#f43f5e',
      border: 'border-rose-500/50'
    },
    {
      id: 'neon-glow',
      name: 'Cyberpunk Glow',
      desc: 'Electric cyan and neon magenta lasers',
      gradient: 'from-cyan-950 via-fuchsia-950 to-zinc-950',
      accent: '#06b6d4',
      border: 'border-cyan-500/50'
    }
  ];

  const availableStyles = styles.length > 0 ? styles : defaultStyles;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-white mb-1 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-pink-400" />
          Choose Visual Style & Atmosphere
        </label>
        <p className="text-xs text-slate-400">
          This sets the background aesthetic, colors, and glow effects of the surprise card.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {availableStyles.map((style) => {
          const isSelected = selectedStyle === style.id || selectedStyle === style.style_name;
          return (
            <button
              key={style.id}
              type="button"
              onClick={() => onSelectStyle(style.id || style.style_name)}
              className={`p-4 rounded-2xl text-left transition-all duration-200 relative overflow-hidden flex flex-col justify-between border ${
                isSelected
                  ? 'border-pink-500 bg-pink-500/10 shadow-glow ring-2 ring-pink-500/30'
                  : 'border-purple-900/40 bg-white/5 hover:border-purple-700 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-5 h-5 rounded-full shadow-sm"
                    style={{ backgroundColor: style.accent || '#ec4899' }}
                  />
                  <span className="font-bold text-white text-sm">{style.name || style.style_name}</span>
                </div>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-pink-500 flex items-center justify-center text-white">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {style.desc || 'Signature aesthetic handcrafted for your surprise.'}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
