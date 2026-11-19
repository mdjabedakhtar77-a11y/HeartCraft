import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Clock, Calendar, Volume2, VolumeX } from 'lucide-react';
import soundEffects from '../../utils/soundEffects';
import { getSafeImageUrl, DEFAULT_FALLBACK_IMAGE } from '../../utils/imageUtils';

export default function AnniversaryExperience({ card, isPreview = false }) {
  const content = card?.content || {};
  const media = card?.media || [];
  const extra = content?.extra_data || {};

  const startDateStr = content?.birthday_date || extra.startDate || '2023-01-01';

  // Live Relationship Time Counter
  const [timeTogether, setTimeTogether] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [musicOn, setMusicOn] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      const start = new Date(startDateStr).getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, now - start);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeTogether({ days, hours, minutes, seconds });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [startDateStr]);

  const milestones = [
    { title: 'The Day We Met', desc: 'When the stars aligned and our worlds collided.' },
    { title: 'Our First Date', desc: 'Endless conversations, nervous smiles, and that magic spark.' },
    { title: 'Saying "I Love You"', desc: 'Three words that changed everything forever.' },
    { title: 'Today & Beyond', desc: 'Still falling more in love with you every single second.' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#180a29] via-[#2a103c] to-[#0f041b] text-white relative overflow-hidden py-10 px-4">
      {/* Top Banner */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between mb-8 z-30 relative">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card border border-pink-500/30">
          <Heart className="w-4 h-4 text-pink-400 fill-pink-400 animate-pulse" />
          <span className="text-xs font-semibold text-pink-300">
            {isPreview ? 'Preview Mode' : 'Happy Anniversary!'}
          </span>
        </div>

        <button
          onClick={() => {
            if (musicOn) {
              soundEffects.stopBackgroundMusic();
              setMusicOn(false);
            } else {
              soundEffects.startBackgroundMusic('sweet-ambient');
              setMusicOn(true);
            }
          }}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card text-xs font-medium text-pink-300 border border-purple-500/30 transition-all"
        >
          {musicOn ? <Volume2 className="w-4 h-4 text-pink-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          <span>{musicOn ? 'Music Playing' : 'Play Music'}</span>
        </button>
      </div>

      <div className="max-w-3xl mx-auto w-full space-y-12 relative z-20 text-center">
        {/* Header */}
        <div className="space-y-3">
          <div className="text-5xl mb-2 animate-wiggle">🥂 ✨</div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-display">
            Happy Anniversary, {card.recipient_name}!
          </h1>
          <p className="text-sm text-pink-200/90 max-w-md mx-auto">
            Celebrating every beautiful memory and counting every blessed second together.
          </p>
        </div>

        {/* Live Relationship Counter */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-pink-500/30 shadow-2xl">
          <div className="flex items-center justify-center gap-2 text-xs font-bold tracking-widest uppercase text-pink-400 mb-6">
            <Clock className="w-4 h-4 text-pink-400" />
            <span>Time We Have Loved Each Other</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="glass-card p-4 rounded-2xl border border-purple-800/40">
              <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">{timeTogether.days}</span>
              <p className="text-xs text-pink-300 mt-1 uppercase font-semibold">Days</p>
            </div>
            <div className="glass-card p-4 rounded-2xl border border-purple-800/40">
              <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">{timeTogether.hours}</span>
              <p className="text-xs text-pink-300 mt-1 uppercase font-semibold">Hours</p>
            </div>
            <div className="glass-card p-4 rounded-2xl border border-purple-800/40">
              <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">{timeTogether.minutes}</span>
              <p className="text-xs text-pink-300 mt-1 uppercase font-semibold">Minutes</p>
            </div>
            <div className="glass-card p-4 rounded-2xl border border-purple-800/40">
              <span className="text-3xl sm:text-4xl font-extrabold text-pink-400 font-mono animate-pulse">{timeTogether.seconds}</span>
              <p className="text-xs text-pink-300 mt-1 uppercase font-semibold">Seconds</p>
            </div>
          </div>
        </div>

        {/* Memory Milestones Timeline */}
        <div className="text-left space-y-6">
          <h3 className="text-xl font-bold text-white text-center sm:text-left flex items-center justify-center sm:justify-start gap-2">
            <Sparkles className="w-5 h-5 text-pink-400" />
            <span>Our Journey So Far</span>
          </h3>

          <div className="space-y-4">
            {milestones.map((ms, idx) => (
              <div key={idx} className="glass-card p-5 rounded-2xl border border-purple-800/40 flex items-start gap-4 hover:border-pink-500/30 transition-all">
                <div className="w-8 h-8 rounded-full bg-pink-500/20 text-pink-400 border border-pink-500/30 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{ms.title}</h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{ms.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Personal Letter */}
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-pink-500/30 shadow-2xl text-left relative">
          <p className="text-lg text-slate-100 font-handwriting leading-loose whitespace-pre-wrap">
            {content.message || 'Happy Anniversary, my soulmate. I am forever grateful for your love, laughter, and companionship.'}
          </p>

          {content.ending_message && (
            <div className="pt-6 text-right">
              <p className="text-pink-300 font-handwriting text-2xl font-bold">
                {content.ending_message}
              </p>
            </div>
          )}

          {/* Photo Gallery */}
          {media.length > 0 && (
            <div className="pt-6 mt-6 border-t border-purple-800/40">
              <p className="text-xs font-semibold text-pink-300 mb-3">Our Captured Moments 📸</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {media.map((item, idx) => (
                  <div key={idx} className="rounded-2xl overflow-hidden aspect-square border border-purple-700/50 shadow-md">
                    <img
                      src={getSafeImageUrl(item.media_url)}
                      alt="Memory"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = DEFAULT_FALLBACK_IMAGE;
                      }}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="text-center text-xs text-slate-500 mt-12">
        Crafted with love on <span className="text-pink-400 font-semibold">HeartCraft</span>
      </div>
    </div>
  );
}
