import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ExperienceRenderer from '../experiences/ExperienceRenderer';
import { Loader2, Heart, AlertCircle } from 'lucide-react';
import api from '../services/api';

export default function RecipientCardPage() {
  const { slug } = useParams();

  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadRecipientCard() {
      try {
        const res = await api.getPublicCard(slug);
        if (res.success && res.card) {
          setCard(res.card);
        } else {
          setError('This surprise could not be found.');
        }
      } catch (err) {
        setError(err.message || 'Unable to open surprise experience.');
      } finally {
        setLoading(false);
      }
    }
    loadRecipientCard();
  }, [slug]);

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

  return <ExperienceRenderer card={card} isPreview={false} />;
}
