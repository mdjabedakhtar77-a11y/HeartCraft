import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, MailOpen, Mail, ShieldAlert, CheckCircle2 } from 'lucide-react';
import soundEffects from '../../utils/soundEffects';

export default function SorryExperience({ card, isPreview = false }) {
  const content = card?.content || {};
  const [sealBroken, setSealBroken] = useState(false);
  const [forgiven, setForgiven] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const apologyNotes = [
    { title: 'I Am Truly Sorry', text: 'I never wanted to hurt you or cause you pain. Seeing you upset breaks my heart.' },
    { title: 'You Mean Everything', text: 'Our bond is the most precious thing in my life, and I take full accountability for my mistake.' },
    { title: 'A Promise to Grow', text: 'I promise to listen more, understand better, and cherish you the way you deserve.' }
  ];

  const handleBreakSeal = () => {
    soundEffects.playPop();
    soundEffects.playRomanticChime();
    setSealBroken(true);
  };

  const handleForgive = () => {
    soundEffects.playCelebrationFanfare();
    setForgiven(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#160824] via-[#240d39] to-[#0c0314] text-white relative overflow-hidden py-10 px-4 flex flex-col justify-between">
      {/* Top Bar */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between z-30">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card border border-purple-500/30">
          <Heart className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-semibold text-purple-300">
            {isPreview ? 'Preview Mode' : `For ${card.recipient_name}`}
          </span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto w-full my-auto text-center relative z-20 py-8">
        {!sealBroken ? (
          /* Step 1: Wax-Sealed Vintage Envelope */
          <div className="space-y-8 animate-fadeIn">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-pink-400">
                A Sincere Letter for {card.recipient_name}
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white mt-2 font-display">
                Please Open With An Open Heart
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-2">
                Click on the golden wax seal below to break it open and read the message.
              </p>
            </div>

            {/* Vintage Envelope Graphic with Wax Seal */}
            <div className="relative mx-auto w-72 sm:w-80 h-52 sm:h-56 rounded-3xl bg-gradient-to-b from-stone-800 to-stone-900 border border-stone-700/80 shadow-2xl flex items-center justify-center p-6">
              {/* Envelope Flap Lines */}
              <div className="absolute inset-0 border-t-2 border-stone-600/40 pointer-events-none rounded-3xl" />

              {/* Interactive Wax Seal */}
              <button
                type="button"
                onClick={handleBreakSeal}
                className="w-20 h-20 rounded-full bg-gradient-to-tr from-rose-700 via-red-600 to-amber-600 shadow-[0_0_25px_rgba(225,29,72,0.6)] flex flex-col items-center justify-center border-2 border-amber-300 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer group"
                title="Click to break wax seal"
              >
                <span className="text-2xl group-hover:rotate-12 transition-transform">💌</span>
                <span className="text-[9px] font-extrabold tracking-widest text-amber-100 uppercase mt-0.5">
                  Break Seal
                </span>
              </button>
            </div>
          </div>
        ) : (
          /* Step 2: Unsealed Apology Carousel & Letter */
          <div className="space-y-8 animate-fadeIn">
            <div>
              <div className="text-5xl mb-2 animate-pulse">🤍</div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-display">
                I am so sorry, {card.recipient_name}.
              </h1>
            </div>

            {/* Apology Cards */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-pink-500/30 text-left relative overflow-hidden">
              <div className="flex gap-2 mb-4">
                {apologyNotes.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveCardIndex(idx)}
                    className={`h-1.5 flex-1 rounded-full transition-all ${
                      activeCardIndex === idx ? 'bg-pink-500' : 'bg-white/10'
                    }`}
                  />
                ))}
              </div>

              <h3 className="text-lg font-bold text-pink-300 mb-2">
                {apologyNotes[activeCardIndex].title}
              </h3>
              <p className="text-sm text-slate-200 leading-relaxed min-h-[50px]">
                {apologyNotes[activeCardIndex].text}
              </p>

              <div className="flex justify-end gap-2 mt-4">
                {activeCardIndex < apologyNotes.length - 1 && (
                  <button
                    onClick={() => setActiveCardIndex((prev) => prev + 1)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 transition-colors"
                  >
                    Next Note →
                  </button>
                )}
              </div>
            </div>

            {/* Personal Letter Message */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-purple-800/40 text-left">
              <h4 className="text-xs font-bold text-pink-400 uppercase tracking-widest mb-3">
                From My Heart to Yours:
              </h4>
              <p className="text-base text-slate-100 font-handwriting leading-loose whitespace-pre-wrap">
                {content.message || 'I hope you can find it in your heart to forgive me. You are irreplaceable to me.'}
              </p>
              {content.ending_message && (
                <p className="text-right text-pink-300 font-handwriting text-xl mt-4 font-bold">
                  {content.ending_message}
                </p>
              )}
            </div>

            {/* Forgiveness Action */}
            <div className="pt-4">
              {!forgiven ? (
                <button
                  onClick={handleForgive}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-bold text-base shadow-glow hover:scale-105 active:scale-95 transition-all"
                >
                  I Forgive You 🤍
                </button>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center gap-2 font-semibold text-sm animate-fadeIn">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Forgiveness Given. Love Wins Every Time! ✨</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="text-center text-xs text-slate-500">
        Crafted with love on <span className="text-pink-400 font-semibold">HeartCraft</span>
      </div>
    </div>
  );
}
