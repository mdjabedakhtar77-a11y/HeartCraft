import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ExperienceRenderer from '../experiences/ExperienceRenderer';
import { Loader2, Heart, Clock, AlertCircle, Sparkles, Hourglass } from 'lucide-react';
import api from '../services/api';

export default function RecipientCardPage() {
  const { slug } = useParams();

  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExpired, setIsExpired] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    async function loadRecipientCard() {
      try {
        const res = await api.getPublicCard(slug);
        if (res.success && res.card) {
          // Check client-side expiration in case of time skew
          if (res.card.expires_at && new Date() > new Date(res.card.expires_at)) {
            setIsExpired(true);
          } else {
            setCard(res.card);
            document.title = `A Special Surprise for ${res.card.recipient_name} ❤️ | HeartCraft`;
          }
        } else {
          if (res.expired) {
            setIsExpired(true);
          } else {
            setError(res.message || 'This surprise could not be found.');
          }
        }
      } catch (err) {
        if (err.expired || (err.message && err.message.toLowerCase().includes('expired'))) {
          setIsExpired(true);
        } else {
          setError(err.message || 'Unable to open surprise experience.');
        }
      } finally {
        setLoading(false);
      }
    }
    loadRecipientCard();
  }, [slug]);

  // Live 24-hour countdown ticker
  useEffect(() => {
    if (!card?.expires_at || isExpired) return;

    function updateCountdown() {
      const diff = new Date(card.expires_at).getTime() - Date.now();
      if (diff <= 0) {
        setIsExpired(true);
        setTimeLeft('Expired');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s left`);
    }

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [card, isExpired]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0717] flex items-center justify-center text-white p-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-pink-500/20 text-pink-400 border border-pink-500/40 flex items-center justify-center mx-auto animate-pulse">
            <Heart className="w-8 h-8 fill-pink-400" />
          </div>
          <p className="text-sm font-semibold text-pink-200">Loading your surprise experience...</p>
        </div>
      </div>
    );
  }

  // 24-Hour Expiration Screen
  if (isExpired) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#180826] via-[#240b36] to-[#0d0315] text-white flex items-center justify-center p-4">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl max-w-lg w-full border border-amber-500/30 text-center space-y-6 shadow-2xl animate-fadeIn">
          <div className="w-20 h-20 rounded-3xl bg-amber-500/20 text-amber-400 border border-amber-500/30 mx-auto flex items-center justify-center shadow-glow">
            <Hourglass className="w-10 h-10 animate-spin text-amber-300" style={{ animationDuration: '6s' }} />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              24-Hour Window Completed
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
              This Surprise Link Has Expired ⏳
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed max-w-md mx-auto pt-2">
              Surprise wishes on HeartCraft are intimate, real-time moments valid for <strong>24 hours</strong>. The viewing window for this wish has ended.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-purple-900/40 text-xs text-slate-400 space-y-1">
            <p className="text-pink-300 font-semibold flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Make someone else's day special!</span>
            </p>
            <p>You can create and send your own digital surprise with interactive cakes, popping balloons, and heartfelt letters in just 2 minutes.</p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/experiences"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs shadow-glow hover:scale-105 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Create a New Surprise ✨</span>
            </Link>

            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 rounded-2xl glass-card hover:bg-white/10 text-slate-300 text-xs font-semibold border border-purple-800/40 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Not Found or General Error Screen
  if (error || !card) {
    return (
      <div className="min-h-screen bg-[#0f0717] flex items-center justify-center text-white p-4">
        <div className="glass-panel p-8 sm:p-10 rounded-3xl max-w-md w-full border border-purple-800/40 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">Surprise Unavailable</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            {error || 'This card may not be published yet or the link is incorrect.'}
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-2.5 rounded-xl bg-pink-500 text-white font-semibold text-xs"
          >
            Visit HeartCraft Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* 24-Hour Floating Expiration Badge */}
      {timeLeft && (
        <div className="fixed top-3 right-3 z-40">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-amber-500/40 text-[11px] font-semibold text-amber-300 shadow-lg">
            <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>24h Wish • {timeLeft}</span>
          </div>
        </div>
      )}

      <ExperienceRenderer card={card} isPreview={false} />
    </div>
  );
}
