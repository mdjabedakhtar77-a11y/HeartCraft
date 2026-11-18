import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Clock, Heart } from 'lucide-react';

export default function MissYou() {
  return (
    <div className="min-h-screen bg-[#0f0717] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 pt-32 pb-20 max-w-4xl mx-auto px-4 w-full text-center space-y-8">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-purple-500/30 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-400">Long Distance & Loved Ones</span>
          <h1 className="text-3xl sm:text-5xl font-black text-white font-display">
            Bridge The Distance 💌
          </h1>
          <p className="text-sm text-slate-300 max-w-lg mx-auto">
            Count down the days apart, schedule secret future letters, and send loving digital surprises across any distance.
          </p>
          <div className="pt-2">
            <Link
              to="/create/miss-you"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold text-sm shadow-glow hover:scale-105 active:scale-95 transition-all"
            >
              <span>Create Miss You Surprise (Free)</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
