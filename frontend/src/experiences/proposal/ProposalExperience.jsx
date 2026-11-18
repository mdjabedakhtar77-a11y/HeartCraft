import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Volume2, VolumeX, ShieldCheck } from 'lucide-react';
import soundEffects from '../../utils/soundEffects';

export default function ProposalExperience({ card, isPreview = false }) {
  const content = card?.content || {};
  const media = card?.media || [];

  const [saidYes, setSaidYes] = useState(false);
  const [noPosition, setNoPosition] = useState({ top: 'auto', left: 'auto' });
  const [noCount, setNoCount] = useState(0);
  const [musicOn, setMusicOn] = useState(false);

  const noPhrases = [
    'No',
    'Are you sure? 🥺',
    'Really sure?',
    'Think again! 💖',
    'Last chance!',
    'Surely not?',
    'You might regret this!',
    'Give it another thought!',
    'Are you absolutely sure?',
    'This could be a mistake!',
    'Have a heart! ❤️',
    'Don\'t be so cold!',
    'Change of heart?',
    'Wouldn\'t you reconsider?',
    'Is that your final answer?',
    'You cannot escape my love! 😉'
  ];

  const handleNoInteraction = () => {
    soundEffects.playPop();
    setNoCount((prev) => prev + 1);

    // Random coordinates within safe viewport margins
    const randomTop = Math.floor(Math.random() * 65) + 15;
    const randomLeft = Math.floor(Math.random() * 65) + 15;

    setNoPosition({
      top: `${randomTop}%`,
      left: `${randomLeft}%`,
      position: 'fixed'
    });
  };

  const handleYes = () => {
    soundEffects.playCelebrationFanfare();
    soundEffects.startBackgroundMusic('romantic-piano');
    setMusicOn(true);
    setSaidYes(true);

    // Blast romantic confetti
    const duration = 4 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ec4899', '#f43f5e', '#a855f7']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ec4899', '#f43f5e', '#a855f7']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  const currentNoText = noPhrases[Math.min(noCount, noPhrases.length - 1)];
  const yesButtonScale = Math.min(1 + noCount * 0.12, 1.8);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0520] via-[#2d092d] to-[#120317] text-white relative overflow-hidden flex flex-col justify-between py-10 px-4">
      {/* Floating Ambient Rose Petals / Hearts */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float opacity-30 text-rose-500"
            style={{
              top: `${(i * 17) % 90}%`,
              left: `${(i * 23) % 95}%`,
              fontSize: `${18 + (i % 4) * 8}px`,
              animationDuration: `${4 + (i % 3) * 2}s`
            }}
          >
            🌸
          </div>
        ))}
      </div>

      {/* Top Banner */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between z-30">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-card border border-rose-500/30">
          <Heart className="w-4 h-4 text-rose-400 fill-rose-400 animate-pulse" />
          <span className="text-xs font-semibold text-rose-300">
            {isPreview ? 'Preview Mode' : 'A Question From The Heart ❤️'}
          </span>
        </div>

        <button
          onClick={() => {
            if (musicOn) {
              soundEffects.stopBackgroundMusic();
              setMusicOn(false);
            } else {
              soundEffects.startBackgroundMusic('romantic-piano');
              setMusicOn(true);
            }
          }}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card text-xs font-medium text-rose-300 border border-rose-500/30 transition-all"
        >
          {musicOn ? <Volume2 className="w-4 h-4 text-rose-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          <span>{musicOn ? 'Music Playing' : 'Play Music'}</span>
        </button>
      </div>

      {/* Proposal Question or Celebration */}
      <div className="max-w-3xl mx-auto w-full my-auto text-center relative z-20 py-8">
        {!saidYes ? (
          <div className="space-y-8 animate-fadeIn">
            {/* Visual Ring / Heart Animation */}
            <div className="inline-block relative">
              <div className="w-32 h-32 sm:w-40 sm:h-40 mx-auto rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 p-1 shadow-glow flex items-center justify-center animate-pulse">
                <div className="w-full h-full bg-[#1e0722] rounded-full flex items-center justify-center text-6xl sm:text-7xl">
                  💍
                </div>
              </div>
            </div>

            {/* Question */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white font-display">
                {card.recipient_name}, {content.question || 'Will You Be My Forever?'}
              </h1>
              <p className="text-sm text-rose-200/90 max-w-lg mx-auto">
                Every heartbeat of mine belongs to you. Today, tomorrow, and for all of eternity.
              </p>
            </div>

            {/* Yes and Moving No Buttons */}
            <div className="flex items-center justify-center gap-6 pt-6 min-h-[100px]">
              {/* Yes Button */}
              <button
                onClick={handleYes}
                style={{ transform: `scale(${yesButtonScale})` }}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white font-extrabold text-lg shadow-glow hover:brightness-110 active:scale-95 transition-all duration-200 z-10"
              >
                YES! 💖
              </button>

              {/* Playful Evasive No Button */}
              <button
                onMouseEnter={handleNoInteraction}
                onClick={handleNoInteraction}
                onTouchStart={handleNoInteraction}
                style={noPosition}
                className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-rose-900/40 text-slate-300 hover:text-white font-medium text-sm border border-purple-800/40 transition-all duration-150 z-20"
              >
                {currentNoText}
              </button>
            </div>
          </div>
        ) : (
          /* Celebration View */
          <div className="space-y-8 animate-fadeIn">
            <div className="text-6xl sm:text-7xl animate-bounce">
              🎉 💖 💍
            </div>

            <div>
              <h1 className="text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-pink-200 to-purple-300 font-display">
                SHE SAID YES!
              </h1>
              <p className="text-rose-300 text-base mt-2">
                The beginning of our greatest adventure together ✨
              </p>
            </div>

            {/* Personal Letter Card */}
            <div className="glass-panel p-8 sm:p-10 rounded-3xl max-w-2xl mx-auto border border-rose-500/40 shadow-2xl text-left relative overflow-hidden">
              <p className="text-lg text-slate-100 font-handwriting leading-loose whitespace-pre-wrap">
                {content.message || 'You made me the happiest person in the entire universe. I promise to love you, cherish you, and stand by you forever and always.'}
              </p>

              {content.ending_message && (
                <div className="pt-6 text-right">
                  <p className="text-rose-300 font-handwriting text-2xl font-bold">
                    {content.ending_message}
                  </p>
                </div>
              )}

              {/* Photos Gallery */}
              {media.length > 0 && (
                <div className="pt-6 mt-6 border-t border-rose-900/30">
                  <p className="text-xs font-semibold text-rose-300 mb-3">Our Love Story 📸</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {media.map((item, idx) => (
                      <div key={idx} className="rounded-2xl overflow-hidden aspect-square border border-rose-500/40 shadow-md">
                        <img src={item.media_url} alt="Memory" className="w-full h-full object-cover hover:scale-105 transition-transform" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Branding */}
      <div className="text-center text-xs text-slate-500 z-20">
        Crafted with love on <span className="text-pink-400 font-semibold">HeartCraft</span>
      </div>
    </div>
  );
}
