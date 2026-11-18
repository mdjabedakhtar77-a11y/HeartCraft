import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Smile, Sparkles, Heart, Gift, MessageCircle } from 'lucide-react';
import soundEffects from '../../utils/soundEffects';

export default function FriendshipExperience({ card, isPreview = false }) {
  const content = card?.content || {};
  const media = card?.media || [];
  const [boxOpened, setBoxOpened] = useState(false);

  const fallbackPolaroids = [
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600',
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600'
  ];

  const photos = media.length > 0 ? media.map((m) => m.media_url) : fallbackPolaroids;

  const handleOpenBox = () => {
    soundEffects.playPop();
    soundEffects.playCelebrationFanfare();
    setBoxOpened(true);
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#19092c] via-[#260e40] to-[#0f041c] text-white py-10 px-4 flex flex-col justify-between">
      {/* Top Banner */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between mb-8 z-30">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card border border-purple-500/30">
          <Smile className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-semibold text-amber-300">
            {isPreview ? 'Preview Mode' : `Besties Forever: ${card.recipient_name}`}
          </span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto w-full my-auto text-center space-y-8 py-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            For My Favorite Partner In Crime
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mt-1 font-display">
            To My Best Friend, {card.recipient_name}!
          </h1>
          <p className="text-sm text-slate-300 mt-2 max-w-md mx-auto">
            Life is 1000x better with you by my side. Here are some of our legendary moments!
          </p>
        </div>

        {/* Polaroids Display */}
        <div className="flex flex-wrap items-center justify-center gap-6 py-4">
          {photos.map((src, idx) => (
            <div
              key={idx}
              className="bg-white p-3 pb-8 rounded-xl shadow-2xl text-slate-800 transform hover:scale-105 transition-transform duration-300 max-w-[220px]"
              style={{
                transform: `rotate(${idx % 2 === 0 ? '-3deg' : '4deg'})`
              }}
            >
              <div className="aspect-square overflow-hidden rounded-lg bg-slate-100">
                <img src={src} alt="Bestie memory" className="w-full h-full object-cover" />
              </div>
              <p className="text-xs font-handwriting text-slate-600 mt-3 text-center text-sm">
                Memory #{idx + 1} ✨
              </p>
            </div>
          ))}
        </div>

        {/* Interactive Bounce Gift Box */}
        {!boxOpened ? (
          <div className="pt-4">
            <button
              onClick={handleOpenBox}
              className="inline-flex flex-col items-center gap-2 p-5 rounded-3xl glass-card border border-amber-500/40 hover:scale-110 active:scale-95 transition-all shadow-glow group cursor-pointer"
            >
              <span className="text-5xl group-hover:animate-bounce">🎁</span>
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Tap to unbox inside joke
              </span>
            </button>
          </div>
        ) : (
          /* Unboxed Letter */
          <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-amber-500/40 shadow-2xl text-left animate-fadeIn">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-3">
              Dear Bestie:
            </h3>
            <p className="text-base text-slate-100 font-handwriting leading-loose whitespace-pre-wrap">
              {content.message || 'Thanks for laughing at my stupid jokes, being there through every crisis, and never judging me. You are stuck with me forever! 🍕✨'}
            </p>
            {content.ending_message && (
              <p className="text-right text-amber-300 font-handwriting text-xl mt-4 font-bold">
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
