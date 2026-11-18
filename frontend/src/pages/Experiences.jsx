import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ExperienceCard from '../components/ExperienceCard';
import { Sparkles, Search, Filter } from 'lucide-react';
import api from '../services/api';

export default function Experiences() {
  const [templates, setTemplates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.getTemplates();
        if (res.success) {
          setTemplates(res.templates || []);
          setCategories(res.categories || []);
        }
      } catch (err) {
        console.warn('Failed to load templates:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredTemplates = templates.filter((tpl) => {
    const matchesCategory =
      activeCategory === 'all' ||
      tpl.category_slug?.toLowerCase() === activeCategory.toLowerCase() ||
      tpl.category?.toLowerCase() === activeCategory.toLowerCase();

    const matchesSearch =
      tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.description?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0f0717] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-pink-400">
            Digital Experience Library
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white mt-2 font-display">
            Interactive Digital Surprises
          </h1>
          <p className="text-slate-300 text-sm mt-3">
            Choose an experience to personalize with your recipient's name, message, photos, and music.
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full md:w-auto scrollbar-none">
            {['all', 'birthday', 'proposal', 'anniversary', 'sorry', 'puzzle', 'friendship'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-pink-500 text-white shadow-glow'
                    : 'glass-card text-slate-300 hover:text-white hover:bg-white/10 border border-purple-900/40'
                }`}
              >
                {cat === 'all' ? 'All Occasions' : cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search experiences..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-purple-900/40 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-pink-500"
            />
          </div>
        </div>

        {/* Templates Grid */}
        {loading ? (
          <div className="text-center py-20 text-slate-400">
            <Sparkles className="w-8 h-8 text-pink-500 animate-spin mx-auto mb-2" />
            <p className="text-sm">Loading experiences...</p>
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="text-center py-20 glass-card rounded-3xl border border-purple-900/40 p-8 max-w-md mx-auto">
            <p className="text-base font-bold text-white">No experiences found</p>
            <p className="text-xs text-slate-400 mt-1">Try selecting another category or clear your search query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((tpl) => (
              <ExperienceCard key={tpl.id} template={tpl} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
