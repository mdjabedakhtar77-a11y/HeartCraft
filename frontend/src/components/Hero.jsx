import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Gift, ArrowRight, Star, ShieldCheck, Play } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-purple-700/25 via-pink-600/20 to-rose-500/15 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-1/2 -left-20 w-80 h-80 bg-pink-600/10 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-pink-500/30 shadow-glow">
              <span className="flex h-2 w-2 rounded-full bg-pink-500 animate-ping" />
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span className="text-xs font-semibold text-pink-300 tracking-wide uppercase">
                The #1 Interactive Digital Greeting Platform
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
              Make Every Moment{' '}
              <span className="bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400 bg-clip-text text-transparent underline decoration-pink-500/40 decoration-wavy decoration-2">
                Unforgettable.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Ditch boring paper cards. Craft immersive digital surprises with popping balloons, blowable birthday candles, interactive proposals with evasive "No" buttons, love timelines, and photo puzzles.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                to="/experiences"
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-bold text-base shadow-glow hover:shadow-pink-500/50 hover:scale-105 active:scale-95 transition-all duration-300"
              >
                <Gift className="w-5 h-5" />
                <span>Explore Surprises</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/card/priya-birthday-magic"
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl glass-card hover:bg-white/10 text-white font-semibold text-sm border border-purple-500/30 transition-all duration-200"
              >
                <Play className="w-4 h-4 text-pink-400 fill-pink-400" />
                <span>See Live Sample</span>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-purple-900/30 flex flex-wrap items-center justify-center lg:justify-start gap-8 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="font-semibold text-white">4.9 / 5</span>
                <span>(12,400+ smiles)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Instant Delivery via Link & QR</span>
              </div>
            </div>
          </div>

          {/* Right Visual Interactive Card Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm sm:max-w-md">
              {/* Decorative floating badges */}
              <div className="absolute -top-6 -left-6 z-20 glass-card px-4 py-2.5 rounded-2xl shadow-glow flex items-center gap-2 border border-pink-500/40 animate-float">
                <span className="text-xl">🎈</span>
                <div>
                  <p className="text-xs font-bold text-white">Interactive Balloons</p>
                  <p className="text-[10px] text-pink-300">Pop on tap with sound!</p>
                </div>
              </div>

              <div className="absolute -bottom-6 -right-6 z-20 glass-card px-4 py-2.5 rounded-2xl shadow-glow flex items-center gap-2 border border-purple-500/40 animate-float" style={{ animationDelay: '1.5s' }}>
                <span className="text-xl">🎂</span>
                <div>
                  <p className="text-xs font-bold text-white">Blow Candles</p>
                  <p className="text-[10px] text-purple-300">Cut cake with knife!</p>
                </div>
              </div>

              {/* Main Sample Card Graphic */}
              <div className="glass-panel p-6 rounded-3xl border border-pink-500/30 shadow-2xl relative overflow-hidden group">
                <div className="relative h-96 rounded-2xl overflow-hidden bg-gradient-to-b from-purple-950 via-slate-900 to-black p-6 flex flex-col justify-between border border-purple-800/40">
                  {/* Floating Stars */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-900/30 via-transparent to-transparent pointer-events-none" />

                  {/* Header */}
                  <div className="flex justify-between items-center relative z-10">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30">
                      Birthday Galaxy ✨
                    </span>
                    <Heart className="w-5 h-5 text-pink-500 fill-pink-500 animate-pulse" />
                  </div>

                  {/* Cake & Candle Centerpiece */}
                  <div className="text-center relative z-10 py-6 my-auto">
                    <div className="text-6xl mb-3 animate-wiggle">🎂</div>
                    <h3 className="text-2xl font-bold font-display text-white">Happy Birthday, Priya!</h3>
                    <p className="text-xs text-pink-200/90 mt-1">Tap balloons to pop & blow out the candles 🕯️</p>
                  </div>

                  {/* Bottom Preview Bar */}
                  <div className="relative z-10 glass-card p-3 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-slate-300">Personalized Letter</p>
                      <p className="text-xs font-semibold text-white">"You light up my entire universe..."</p>
                    </div>
                    <Link
                      to="/create/birthday"
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-pink-500 text-white hover:bg-pink-600 transition-colors shadow-sm"
                    >
                      Customize
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
