import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Heart, Sparkles, Share2, Copy, Check, ExternalLink, MessageCircle, Eye, Calendar, Plus, Loader2 } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import soundEffects from '../utils/soundEffects';

export default function MyCardsPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedSlug, setCopiedSlug] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    async function loadCards() {
      try {
        const res = await api.getMyCards();
        if (res.success && Array.isArray(res.cards)) {
          setCards(res.cards);
        }
      } catch (err) {
        console.warn('Failed to load user cards:', err);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      loadCards();
    }
  }, [user, authLoading, navigate]);

  const getCardUrl = (slug) => {
    return `${window.location.origin}/card/${slug}`;
  };

  const handleCopy = (slug) => {
    const url = getCardUrl(slug);
    navigator.clipboard.writeText(url);
    soundEffects.playPop();
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2500);
  };

  const handleNativeShare = async (card) => {
    const url = getCardUrl(card.slug);
    const title = `Surprise for ${card.recipient_name}! ❤️`;
    const text = `✨ Hey ${card.recipient_name}! I created an interactive surprise for you on HeartCraft ❤️ Open it here:`;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (err) {
        if (err.name !== 'AbortError') {
          handleCopy(card.slug);
        }
      }
    } else {
      handleCopy(card.slug);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#0f0717] flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-white">
          <div className="text-center space-y-3">
            <Loader2 className="w-10 h-10 text-pink-500 animate-spin mx-auto" />
            <p className="text-sm font-semibold text-pink-200">Loading your surprises...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0717] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 pt-32 pb-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-pink-400">
              Personal Collection
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white mt-1 font-display">
              My Created Surprises 💌
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              Easily share, copy links, or open any surprise card you've crafted.
            </p>
          </div>

          <Link
            to="/experiences"
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs shadow-glow hover:scale-105 active:scale-95 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Surprise</span>
          </Link>
        </div>

        {cards.length === 0 ? (
          <div className="glass-panel p-12 rounded-3xl border border-purple-800/40 text-center space-y-6 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-pink-500/20 text-pink-400 border border-pink-500/30 mx-auto flex items-center justify-center">
              <Heart className="w-8 h-8 fill-pink-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">No Surprises Created Yet</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                You haven't created any digital surprise cards yet. Pick a template and surprise someone special in seconds!
              </p>
            </div>
            <Link
              to="/experiences"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs shadow-glow hover:scale-105 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Explore Templates</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card) => {
              const url = getCardUrl(card.slug);
              const isCopied = copiedSlug === card.slug;
              const waText = encodeURIComponent(
                `✨ Hey ${card.recipient_name}! I made a special digital surprise just for you on HeartCraft ❤️ Open it here:\n${url}`
              );

              return (
                <div
                  key={card.id}
                  className="glass-card rounded-2xl p-5 border border-purple-800/40 hover:border-pink-500/40 transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 uppercase tracking-wide">
                        {card.template?.category || 'Surprise'}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-purple-400" />
                        {card.views_count || 0} views
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-pink-300 transition-colors">
                      For: {card.recipient_name}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-2">
                      {card.content?.message || card.template?.name || 'Personalized interactive card'}
                    </p>
                  </div>

                  {/* Share Link Preview */}
                  <div className="space-y-3 pt-3 border-t border-purple-900/40">
                    <div className="bg-black/40 rounded-xl px-3 py-2 flex items-center justify-between gap-2 border border-purple-900/30">
                      <span className="font-mono text-[11px] text-pink-300 truncate">
                        {url}
                      </span>
                      <button
                        onClick={() => handleCopy(card.slug)}
                        title="Copy Share Link"
                        className="text-slate-400 hover:text-white transition-colors shrink-0"
                      >
                        {isCopied ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => handleNativeShare(card)}
                        className="flex items-center justify-center gap-1 py-2 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 font-bold text-[11px] border border-pink-500/30 transition-all"
                      >
                        <Share2 className="w-3 h-3" />
                        <span>Share</span>
                      </button>

                      <a
                        href={`https://api.whatsapp.com/send?text=${waText}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-1 py-2 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] font-bold text-[11px] border border-[#25D366]/30 transition-all"
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>WhatsApp</span>
                      </a>

                      <Link
                        to={`/card/${card.slug}`}
                        target="_blank"
                        className="flex items-center justify-center gap-1 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-bold text-[11px] border border-purple-500/30 transition-all"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Open</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
