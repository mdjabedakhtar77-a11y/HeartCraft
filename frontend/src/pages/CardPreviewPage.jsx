import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Loader2, Send } from 'lucide-react';
import ExperienceRenderer from '../experiences/ExperienceRenderer';
import api from '../services/api';

export default function CardPreviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadPreview() {
      try {
        const res = await api.getPreview(id);
        if (res.success && res.preview) {
          setCard(res.preview);
        } else {
          setError('Could not load card preview.');
        }
      } catch (err) {
        setError(err.message || 'Failed to load preview.');
      } finally {
        setLoading(false);
      }
    }
    loadPreview();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0717] flex items-center justify-center text-white">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-pink-500 animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold">Generating live preview...</p>
        </div>
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="min-h-screen bg-[#0f0717] flex items-center justify-center text-white p-4">
        <div className="glass-panel p-8 rounded-3xl max-w-md text-center space-y-4">
          <p className="text-rose-400 font-bold">{error || 'Preview unavailable'}</p>
          <button
            onClick={() => navigate('/experiences')}
            className="px-6 py-2.5 rounded-xl bg-pink-500 text-white font-semibold text-xs"
          >
            Back to Experiences
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Fixed Floating Preview Control Bar */}
      <div className="fixed top-4 left-4 right-4 z-50 flex items-center justify-between glass-panel px-4 py-3 rounded-2xl border border-pink-500/40 shadow-glow max-w-4xl mx-auto backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
          <span className="hidden sm:inline-block text-xs font-bold text-pink-300">
            Preview Mode • {card.recipient_name}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            disabled={publishing}
            onClick={async () => {
              try {
                setPublishing(true);
                await api.publishCard(card.id);
                navigate(`/success/${card.id}`);
              } catch (err) {
                alert(err.message || 'Failed to publish card');
                setPublishing(false);
              }
            }}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs shadow-glow hover:scale-105 active:scale-95 transition-all"
          >
            {publishing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>Publish & Share (Free) ✨</span>
          </button>
        </div>
      </div>

      {/* Actual Live Experience Container */}
      <div className="pt-16">
        <ExperienceRenderer card={card} isPreview={true} />
      </div>
    </div>
  );
}
