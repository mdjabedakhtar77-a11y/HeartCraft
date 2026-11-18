import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import TrendingCarousel from '../components/TrendingCarousel';
import HowItWorks from '../components/HowItWorks';
import ReviewSection from '../components/ReviewSection';
import Footer from '../components/Footer';
import ExperienceCard from '../components/ExperienceCard';
import { Sparkles, Gift, ArrowRight, Heart, Users, Eye, Star } from 'lucide-react';
import api from '../services/api';

export default function Home() {
  const [templates, setTemplates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const tRes = await api.getTemplates();
        if (tRes.success) {
          setTemplates(tRes.templates || []);
          setCategories(tRes.categories || []);
        }
        const rRes = await api.getAdminReviews().catch(() => ({ reviews: [] }));
        if (rRes.reviews) setReviews(rRes.reviews);
      } catch (err) {
        console.warn('Failed to fetch home templates:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0717] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero />

        {/* Categories Explorer Section */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-pink-400">Digital Surprise Catalog</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              Browse By Occasion
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'Birthday', path: '/birthday', icon: '🎂', desc: 'Balloons & cake' },
              { name: 'Proposal', path: '/proposal', icon: '💍', desc: 'Evasive No button' },
              { name: 'Anniversary', path: '/anniversary', icon: '🥂', desc: 'Live love counter' },
              { name: 'Sorry', path: '/sorry', icon: '💌', desc: 'Wax seal envelope' },
              { name: 'Photo Puzzle', path: '/puzzle', icon: '🧩', desc: 'Secret reveal' },
              { name: 'Friendship', path: '/friendship', icon: '🍕', desc: 'Bestie polaroids' },
            ].map((cat) => (
              <Link
                key={cat.name}
                to={cat.path}
                className="glass-card p-5 rounded-2xl border border-purple-900/40 hover:border-pink-500/50 hover:-translate-y-1 transition-all text-center group"
              >
                <span className="text-4xl block mb-2 group-hover:scale-110 transition-transform">{cat.icon}</span>
                <h3 className="text-sm font-bold text-white group-hover:text-pink-300 transition-colors">{cat.name}</h3>
                <p className="text-[11px] text-slate-400 mt-1">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Trending Surprise Carousel */}
        <TrendingCarousel templates={templates} />

        {/* Statistics Bar (Page 3 & 15 requirement) */}
        <section className="py-12 border-y border-purple-900/40 bg-gradient-to-r from-purple-950/40 via-pink-950/20 to-purple-950/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-300 font-mono">
                  50,000+
                </p>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">Surprises Created</p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-300 font-mono">
                  180,000+
                </p>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">Happy Views</p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-300 font-mono">
                  4.9 / 5
                </p>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">Customer Rating</p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 font-mono">
                  Instant
                </p>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">Delivery via Link & QR</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <HowItWorks />

        {/* Reviews */}
        <ReviewSection reviews={reviews} />

        {/* Final CTA Banner (Page 15 requirement) */}
        <section className="py-20 relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="glass-panel p-10 sm:p-14 rounded-3xl border border-pink-500/40 shadow-glow text-center space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Heart className="w-64 h-64 text-pink-500 fill-pink-500" />
              </div>

              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Instant Digital Surprise</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight max-w-2xl mx-auto leading-tight font-display">
                Ready to Make Someone's Entire Day Unforgettable?
              </h2>

              <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
                Customize their name, photos, popping balloons, and personal message in under 2 minutes.
              </p>

              <div className="pt-2">
                <Link
                  to="/experiences"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-bold text-base shadow-glow hover:scale-105 active:scale-95 transition-all"
                >
                  <Gift className="w-5 h-5" />
                  <span>Create a Surprise Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
