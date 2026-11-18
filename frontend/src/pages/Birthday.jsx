import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ExperienceCard from '../components/ExperienceCard';
import { Cake, Sparkles, Wind, Scissors, Gift, ArrowRight } from 'lucide-react';
import api from '../services/api';

export default function Birthday() {
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getTemplatesByCategory('birthday');
        if (res.success) setTemplates(res.templates || []);
      } catch (e) {
        console.warn(e);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0717] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Hero Banner */}
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-pink-500/30 mb-14 text-center relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <span className="text-xs font-bold uppercase tracking-widest text-pink-400">
              Interactive Birthday Cards
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white font-display">
              Make Their Birthday Truly Magical 🎂
            </h1>
            <p className="text-sm sm:text-base text-slate-300">
              Includes virtual balloons they can tap to pop, 3D candles to blow out, interactive cake slicing with knife sound, and a personalized unfolding letter.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/create/birthday"
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-sm shadow-glow hover:scale-105 active:scale-95 transition-all"
              >
                Create Birthday Card (Free)
              </Link>
              <Link
                to="/card/priya-birthday-magic"
                className="px-6 py-3 rounded-2xl glass-card hover:bg-white/10 text-white text-sm font-semibold border border-purple-500/40"
              >
                View Live Demo ✨
              </Link>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-14">
          <div className="glass-card p-6 rounded-2xl border border-purple-800/40 text-center">
            <span className="text-4xl block mb-2">🎈</span>
            <h3 className="text-base font-bold text-white">Popping Balloons</h3>
            <p className="text-xs text-slate-400 mt-1">Realistic bubble pop sound and confetti bursts when tapped.</p>
          </div>
          <div className="glass-card p-6 rounded-2xl border border-purple-800/40 text-center">
            <span className="text-4xl block mb-2">🕯️</span>
            <h3 className="text-base font-bold text-white">Blowable Candles</h3>
            <p className="text-xs text-slate-400 mt-1">Extinguishes flickering flames with authentic whoosh sounds.</p>
          </div>
          <div className="glass-card p-6 rounded-2xl border border-purple-800/40 text-center">
            <span className="text-4xl block mb-2">🍰</span>
            <h3 className="text-base font-bold text-white">Cake Slicing</h3>
            <p className="text-xs text-slate-400 mt-1">Interactive knife cut animation reveals the surprise letter.</p>
          </div>
        </div>

        {/* Templates */}
        <h2 className="text-2xl font-bold text-white mb-6">Birthday Designs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((tpl) => (
            <ExperienceCard key={tpl.id} template={tpl} categorySlug="birthday" />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
