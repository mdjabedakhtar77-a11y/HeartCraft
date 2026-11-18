import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Heart, Sparkles } from 'lucide-react';

export default function ThankYou() {
  return (
    <div className="min-h-screen bg-[#0f0717] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 pt-32 pb-20 max-w-4xl mx-auto px-4 w-full text-center space-y-8">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-pink-500/30 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-pink-400">Gratitude & Appreciation</span>
          <h1 className="text-3xl sm:text-5xl font-black text-white font-display">
            Show Heartfelt Gratitude ✨
          </h1>
          <p className="text-sm text-slate-300 max-w-lg mx-auto">
            Say thank you in a way they will never forget with interactive animations, warm handwritten calligraphy, and personalized photo memories.
          </p>
          <div className="pt-2">
            <Link
              to="/create/thank-you"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-sm shadow-glow hover:scale-105 active:scale-95 transition-all"
            >
              <span>Create Thank You Surprise (Free)</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
