import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Puzzle, Sparkles, Trophy, RotateCcw } from 'lucide-react';
import soundEffects from '../../utils/soundEffects';
import { getSafeImageUrl, DEFAULT_FALLBACK_IMAGE } from '../../utils/imageUtils';

export default function PuzzleExperience({ card, isPreview = false }) {
  const content = card?.content || {};
  const media = card?.media || [];

  const puzzleImage = getSafeImageUrl(media[0]?.media_url);

  // 3x3 Grid: 9 tiles
  const [tiles, setTiles] = useState([1, 4, 2, 0, 5, 3, 7, 6, 8]); // Scrambled indices
  const [selectedTile, setSelectedTile] = useState(null);
  const [moves, setMoves] = useState(0);
  const [solved, setSolved] = useState(false);

  const checkSolved = (currentTiles) => {
    for (let i = 0; i < currentTiles.length; i++) {
      if (currentTiles[i] !== i) return false;
    }
    return true;
  };

  const handleTileClick = (index) => {
    if (solved) return;

    if (selectedTile === null) {
      soundEffects.playPop();
      setSelectedTile(index);
    } else {
      soundEffects.playPop();
      // Swap tiles
      const nextTiles = [...tiles];
      const temp = nextTiles[selectedTile];
      nextTiles[selectedTile] = nextTiles[index];
      nextTiles[index] = temp;

      setTiles(nextTiles);
      setSelectedTile(null);
      setMoves((m) => m + 1);

      if (checkSolved(nextTiles)) {
        setSolved(true);
        soundEffects.playCelebrationFanfare();
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    }
  };

  const handleInstantSolve = () => {
    const solvedArray = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    setTiles(solvedArray);
    setSolved(true);
    soundEffects.playCelebrationFanfare();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#11051e] via-[#1f0933] to-[#0a0212] text-white py-10 px-4 flex flex-col justify-between">
      {/* Top Banner */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between mb-6 z-30">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card border border-purple-500/30">
          <Puzzle className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-semibold text-purple-300">
            {isPreview ? 'Preview Mode' : `Photo Puzzle for ${card.recipient_name}`}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-purple-300">
          <span>Moves: {moves}</span>
          {!solved && (
            <button
              onClick={handleInstantSolve}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-pink-500/20 text-pink-300 hover:bg-pink-500/30 border border-pink-500/40"
            >
              Solve It
            </button>
          )}
        </div>
      </div>

      <div className="max-w-md mx-auto w-full my-auto text-center space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {solved ? '🎉 Puzzle Complete!' : '🧩 Solve To Reveal The Secret'}
          </h1>
          <p className="text-xs text-purple-300/80 mt-1">
            {solved ? 'You unlocked the hidden message below!' : 'Tap any two pieces to swap them until the picture is complete.'}
          </p>
        </div>

        {/* 3x3 Puzzle Board */}
        <div className="glass-panel p-3 rounded-3xl border border-purple-500/40 shadow-2xl inline-block max-w-[340px] sm:max-w-[380px] w-full">
          <div className="grid grid-cols-3 gap-1.5 aspect-square rounded-2xl overflow-hidden bg-purple-950/60 p-1">
            {tiles.map((tileIndex, slotIndex) => {
              const row = Math.floor(tileIndex / 3);
              const col = tileIndex % 3;
              const isSelected = selectedTile === slotIndex;

              return (
                <button
                  key={slotIndex}
                  onClick={() => handleTileClick(slotIndex)}
                  className={`relative aspect-square overflow-hidden rounded-xl transition-all duration-200 border ${
                    isSelected
                      ? 'border-pink-400 ring-2 ring-pink-400 scale-95 z-10'
                      : 'border-white/10 hover:border-pink-500/50'
                  }`}
                  style={{
                    backgroundImage: `url(${puzzleImage})`,
                    backgroundSize: '300% 300%',
                    backgroundPosition: `${col * 50}% ${row * 50}%`
                  }}
                >
                  <span className="absolute bottom-1 right-1 text-[9px] px-1 rounded bg-black/60 text-white font-mono">
                    {tileIndex + 1}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Hidden Secret Message Revealed Upon Solving */}
        {solved && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-pink-500/40 shadow-glow text-left animate-fadeIn">
            <div className="flex items-center gap-2 text-pink-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Secret Message Revealed!</span>
            </div>
            <p className="text-base text-slate-100 font-handwriting leading-loose whitespace-pre-wrap">
              {content.message || 'You solved the puzzle, just like you solved every puzzle in my heart! Love you always.'}
            </p>
            {content.ending_message && (
              <p className="text-right text-pink-300 font-handwriting text-xl mt-3 font-bold">
                {content.ending_message}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="text-center text-xs text-slate-500">
        Crafted with love on <span className="text-pink-400 font-semibold">HeartCraft</span>
      </div>
    </div>
  );
}
