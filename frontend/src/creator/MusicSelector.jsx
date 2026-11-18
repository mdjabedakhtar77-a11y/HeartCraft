import React, { useState } from 'react';
import { Music, Play, Square, Volume2, UploadCloud } from 'lucide-react';
import soundEffects from '../utils/soundEffects';

export default function MusicSelector({ selectedMusic, onSelectMusic }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const presets = [
    { id: 'birthday-acoustic', name: 'Happy Birthday Melodic Chill', tag: 'Acoustic / Relaxed' },
    { id: 'romantic-piano', name: 'Forever With You Chimes', tag: 'Romantic / Cinematic' },
    { id: 'sweet-ambient', name: 'Golden Memories Lo-Fi', tag: 'Ambient / Gentle' },
    { id: 'celebration-fanfare', name: 'Festive Joy & Sparkles', tag: 'Celebratory / Upbeat' }
  ];

  const handleTogglePlay = () => {
    if (isPlaying) {
      soundEffects.stopBackgroundMusic();
      setIsPlaying(false);
    } else {
      soundEffects.startBackgroundMusic(selectedMusic);
      setIsPlaying(true);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-semibold text-white mb-1 flex items-center gap-2">
            <Music className="w-4 h-4 text-pink-400" />
            Background Music & Melodies
          </label>
          <p className="text-xs text-slate-400">
            Music will play gently in the background while the recipient interacts with the surprise.
          </p>
        </div>

        {/* Audio Test Button */}
        <button
          type="button"
          onClick={handleTogglePlay}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-pink-500/20 text-pink-300 border border-pink-500/30 hover:bg-pink-500/30 text-xs font-semibold transition-all"
        >
          {isPlaying ? <Square className="w-3.5 h-3.5 fill-pink-300" /> : <Play className="w-3.5 h-3.5 fill-pink-300" />}
          <span>{isPlaying ? 'Stop Music' : 'Test Music'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {presets.map((preset) => {
          const isSelected = selectedMusic === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => {
                onSelectMusic(preset.id);
                if (isPlaying) {
                  soundEffects.stopBackgroundMusic();
                  soundEffects.startBackgroundMusic(preset.id);
                }
              }}
              className={`p-3.5 rounded-2xl text-left border transition-all flex items-center justify-between ${
                isSelected
                  ? 'border-pink-500 bg-pink-500/15 shadow-glow'
                  : 'border-purple-900/40 bg-white/5 hover:border-purple-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${isSelected ? 'bg-pink-500 text-white' : 'bg-white/10 text-slate-400'}`}>
                  <Volume2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{preset.name}</h4>
                  <span className="text-[10px] text-pink-300">{preset.tag}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
