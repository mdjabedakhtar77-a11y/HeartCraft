import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ExperienceCard from '../components/ExperienceCard';
import { MailOpen } from 'lucide-react';
import api from '../services/api';

export default function Sorry() {
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getTemplatesByCategory('sorry');
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
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-purple-500/30 mb-14 text-center relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
              Heartfelt Apologies
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white font-display">
              Say Sorry From The Heart 🤍
            </h1>
            <p className="text-sm sm:text-base text-slate-300">
              An interactive wax-sealed vintage envelope with emotional slide-out cards and a warm forgiveness button to heal and reconnect.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/create/sorry"
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold text-sm shadow-glow hover:scale-105 active:scale-95 transition-all"
              >
                Create Apology Card (Free)
              </Link>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-6">Apology Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((tpl) => (
            <ExperienceCard key={tpl.id} template={tpl} categorySlug="sorry" />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
