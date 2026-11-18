import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Music, Volume2, VolumeX, Heart, Wind, Scissors } from 'lucide-react';
import soundEffects from '../../utils/soundEffects';

export default function BirthdayExperience({ card, isPreview = false }) {
  const content = card?.content || {};
  const settings = card?.settings || {};
  const media = card?.media || [];

  // Interactive States
  const [unboxed, setUnboxed] = useState(false);
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [cakeCut, setCakeCut] = useState(false);
  const [balloons, setBalloons] = useState([
    { id: 1, popped: false, color: '#ec4899', x: 10, y: 15, size: 55 },
    { id: 2, popped: false, color: '#8b5cf6', x: 25, y: 30, size: 65 },
    { id: 3, popped: false, color: '#06b6d4', x: 75, y: 20, size: 50 },
    { id: 4, popped: false, color: '#f59e0b', x: 85, y: 35, size: 60 },
    { id: 5, popped: false, color: '#10b981', x: 18, y: 60, size: 52 },
    { id: 6, popped: false, color: '#f43f5e', x: 80, y: 65, size: 58 }
  ]);
  const [musicOn, setMusicOn] = useState(false);

  // Trigger celebration confetti
  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Pop a balloon
  const handlePopBalloon = (id) => {
    soundEffects.playPop();
    setBalloons((prev) =>
      prev.map((b) => (b.id === id ? { ...b, popped: true } : b))
    );
    confetti({
      particleCount: 25,
      spread: 40,
      origin: { x: 0.5, y: 0.4 }
    });
  };

  // Blow out candles
  const handleBlowCandles = () => {
    soundEffects.playBlow();
    setCandlesBlown(true);
    triggerConfetti();
    soundEffects.playCelebrationFanfare();
  };

  // Cut cake
  const handleCutCake = () => {
    soundEffects.playSlice();
    setCakeCut(true);
    triggerConfetti();
    confetti({
      particleCount: 120,
      spread: 100,
      origin: { y: 0.5 }
    });
  };

  const toggleMusic = () => {
    if (musicOn) {
      soundEffects.stopBackgroundMusic();
      setMusicOn(false);
    } else {
      soundEffects.startBackgroundMusic('birthday');
      setMusicOn(true);
    }
  };

  useEffect(() => {
    return () => {
      soundEffects.stopBackgroundMusic();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#150727] via-[#21093a] to-[#0c0316] text-white relative overflow-hidden flex flex-col justify-between py-10 px-4">
      {/* Floating Interactive Balloons */}
      {unboxed &&
        balloons.map((b) =>
          !b.popped ? (
            <button
              key={b.id}
              onClick={() => handlePopBalloon(b.id)}
              className="absolute z-20 transition-transform hover:scale-125 active:scale-95 animate-float cursor-pointer"
              style={{
                left: `${b.x}%`,
                top: `${b.y}%`,
                animationDuration: `${3.5 + b.id * 0.5}s`
              }}
              title="Tap to pop!"
            >
              <div
                className="rounded-full shadow-lg flex items-center justify-center text-white/40 text-xs font-bold"
                style={{
                  width: `${b.size}px`,
                  height: `${b.size * 1.2}px`,
                  backgroundColor: b.color,
                  boxShadow: `0 10px 25px ${b.color}66`
                }}
              >
                🎈
              </div>
              <div className="w-0.5 h-6 bg-white/40 mx-auto" />
            </button>
          ) : null
        )}

      {/* Top Bar with Music Toggle */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between z-30">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-card border border-pink-500/30">
          <Sparkles className="w-4 h-4 text-pink-400" />
          <span className="text-xs font-semibold text-pink-300">
            {isPreview ? 'Preview Mode' : `Happy Birthday, ${card.recipient_name || 'My Love'}!`}
          </span>
        </div>

        <button
          onClick={toggleMusic}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card hover:bg-white/10 text-xs font-medium text-pink-300 border border-purple-500/30 transition-all"
        >
          {musicOn ? <Volume2 className="w-4 h-4 text-pink-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          <span>{musicOn ? 'Music Playing' : 'Play Music'}</span>
        </button>
      </div>

      {/* Main Experience Stage */}
      <div className="max-w-3xl mx-auto w-full my-auto text-center relative z-20 py-8">
        {!unboxed ? (
          /* Step 1: Magical Gift Box Opening */
          <div className="space-y-6">
            <div className="inline-block animate-float">
              <div className="w-36 h-36 sm:w-44 sm:h-44 mx-auto rounded-3xl bg-gradient-to-tr from-pink-600 via-rose-500 to-purple-600 p-1 shadow-glow flex items-center justify-center relative cursor-pointer group"
                onClick={() => {
                  setUnboxed(true);
                  triggerConfetti();
                  soundEffects.playCelebrationFanfare();
                  soundEffects.startBackgroundMusic('birthday');
                  setMusicOn(true);
                }}
              >
                <div className="w-full h-full bg-[#1e0a35] rounded-[22px] flex flex-col items-center justify-center p-4 group-hover:scale-105 transition-transform">
                  <span className="text-6xl sm:text-7xl mb-2">🎁</span>
                  <span className="text-xs font-bold text-pink-300 tracking-wider uppercase">Tap to Open</span>
                </div>
              </div>
            </div>
            <div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-display">
                A Surprise For {card.recipient_name || 'You'} ✨
              </h1>
              <p className="text-sm text-pink-200/80 mt-2">
                Someone special has prepared an interactive celebration for you. Tap the gift box!
              </p>
            </div>
          </div>
        ) : (
          /* Step 2: Birthday Celebration Stage */
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h1 className="text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-200 to-purple-300 font-display">
                Happy Birthday, {card.recipient_name}!
              </h1>
              <p className="text-xs sm:text-sm text-pink-300/80 mt-2">
                🎈 Tap the floating balloons to pop them!
              </p>
            </div>

            {/* Interactive Birthday Cake */}
            <div className="relative py-4 inline-block">
              {/* Candles */}
              <div className="flex justify-center gap-6 mb-1">
                {[1, 2, 3].map((candle) => (
                  <div key={candle} className="flex flex-col items-center">
                    {!candlesBlown ? (
                      <div className="w-4 h-6 rounded-full bg-gradient-to-t from-orange-500 via-amber-400 to-yellow-200 animate-flame shadow-[0_0_15px_#f59e0b]" />
                    ) : (
                      <div className="w-2 h-4 text-slate-400 text-[10px] animate-pulse">💨</div>
                    )}
                    <div className="w-2.5 h-8 bg-gradient-to-b from-pink-300 to-purple-400 rounded-sm shadow-sm" />
                  </div>
                ))}
              </div>

              {/* Cake Body */}
              <div className={`w-56 sm:w-64 mx-auto rounded-3xl p-6 shadow-2xl transition-all duration-500 relative border ${
                cakeCut
                  ? 'bg-gradient-to-r from-pink-800 to-purple-900 border-pink-400/50'
                  : 'bg-gradient-to-b from-pink-600 via-rose-700 to-purple-900 border-pink-500/40'
              }`}>
                {/* Cake Frosting layer */}
                <div className="text-5xl mb-2">
                  {cakeCut ? '🍰 🍰' : '🎂'}
                </div>
                <p className="text-xs font-bold text-white tracking-wider uppercase">
                  {cakeCut ? 'Cake is Served!' : 'Make A Wish!'}
                </p>
              </div>

              {/* Interaction Buttons for Cake */}
              <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                {!candlesBlown ? (
                  <button
                    onClick={handleBlowCandles}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 text-white font-bold text-sm shadow-lg hover:scale-105 active:scale-95 transition-all"
                  >
                    <Wind className="w-4 h-4" />
                    <span>Blow Out Candles 🕯️</span>
                  </button>
                ) : !cakeCut ? (
                  <button
                    onClick={handleCutCake}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-sm shadow-glow hover:scale-105 active:scale-95 transition-all"
                  >
                    <Scissors className="w-4 h-4" />
                    <span>Cut The Cake 🔪</span>
                  </button>
                ) : (
                  <div className="px-4 py-2 rounded-xl bg-pink-500/20 text-pink-300 text-xs font-semibold border border-pink-500/30">
                    ✨ You made a wish! May it come true!
                  </div>
                )}
              </div>
            </div>

            {/* Personalized Letter Section */}
            {(cakeCut || candlesBlown) && (
              <div className="glass-panel p-8 sm:p-10 rounded-3xl max-w-2xl mx-auto border border-pink-500/30 shadow-2xl text-left relative overflow-hidden animate-fadeIn">
                <div className="absolute top-0 right-0 p-4 opacity-20">
                  <Heart className="w-24 h-24 text-pink-500 fill-pink-500" />
                </div>

                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-purple-800/40">
                    <span className="text-xs font-bold uppercase tracking-widest text-pink-400">
                      Personal Message for You
                    </span>
                    <span className="text-xs text-slate-400">
                      From your {content.relationship || 'Loved One'}
                    </span>
                  </div>

                  {/* Letter Message */}
                  <p className="text-base sm:text-lg text-slate-100 font-handwriting leading-relaxed sm:leading-loose whitespace-pre-wrap">
                    {content.message || 'Happy Birthday! Wishing you endless smiles and wonder.'}
                  </p>

                  {/* Sign-off */}
                  {content.ending_message && (
                    <div className="pt-4 text-right">
                      <p className="text-sm font-semibold text-pink-300 font-handwriting text-xl">
                        {content.ending_message}
                      </p>
                    </div>
                  )}

                  {/* Optional Photos */}
                  {media.length > 0 && (
                    <div className="pt-6 border-t border-purple-800/30">
                      <p className="text-xs font-semibold text-slate-300 mb-3">Our Moments Together 📸</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {media.map((item, idx) => (
                          <div key={idx} className="rounded-2xl overflow-hidden aspect-square border border-purple-700/50 shadow-md">
                            <img src={item.media_url} alt="Memory" className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
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
