import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import confetti from 'canvas-confetti';
import { CheckCircle2, Share2, Copy, Check, MessageCircle, Mail, ExternalLink, QrCode, Download, Sparkles } from 'lucide-react';
import api from '../services/api';
import soundEffects from '../utils/soundEffects';

export default function SuccessPage() {
  const { id } = useParams();
  const [card, setCard] = useState(null);
  const [shareDetails, setShareDetails] = useState(null);
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSuccessData() {
      try {
        const cardRes = await api.getCard(id);
        if (cardRes.success && cardRes.card) {
          setCard(cardRes.card);

          // Get Share URLs
          const shareRes = await api.getShareDetails(cardRes.card.id);
          if (shareRes.success) {
            setShareDetails(shareRes.share);
          }

          // Get QR Code
          const qrRes = await api.getQrCode(cardRes.card.id);
          if (qrRes.success) {
            setQrDataUrl(qrRes.qrDataUrl);
          }

          // Trigger celebration
          soundEffects.playCelebrationFanfare();
          confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.5 }
          });
        }
      } catch (err) {
        console.warn('Error loading success card:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSuccessData();
  }, [id]);

  const handleCopyLink = () => {
    if (shareDetails?.cardUrl) {
      navigator.clipboard.writeText(shareDetails.cardUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0717] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 pt-32 pb-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-pink-500/30 text-center space-y-8 animate-fadeIn">
          {/* Success Check Icon */}
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mx-auto flex items-center justify-center animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Instantly Published & Free Forever
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white mt-1 font-display">
              Your Surprise Is Live! 🎉
            </h1>
            <p className="text-sm text-slate-300 mt-2 max-w-md mx-auto">
              The surprise card for <span className="text-pink-400 font-bold">{card?.recipient_name}</span> is ready. Send it right now!
            </p>
          </div>

          {/* Share Link Box */}
          <div className="glass-card p-4 rounded-2xl border border-purple-800/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
            <div className="truncate w-full sm:w-auto flex-1 font-mono text-xs text-pink-300 bg-black/40 px-3 py-2 rounded-xl border border-purple-900/40">
              {shareDetails?.cardUrl || `Loading unique link...`}
            </div>

            <button
              onClick={handleCopyLink}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-semibold text-xs transition-colors shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>

          {/* QR Code and Sharing Actions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-purple-900/40 text-left">
            {/* WhatsApp Share Card */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Share2 className="w-4 h-4 text-pink-400" />
                <span>Instant Social Sharing</span>
              </h3>

              <div className="flex flex-col gap-3">
                {shareDetails?.whatsappUrl && (
                  <a
                    href={shareDetails.whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-black font-bold text-xs shadow-md transition-transform hover:scale-105"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send via WhatsApp</span>
                  </a>
                )}

                <a
                  href={`mailto:?subject=${shareDetails?.emailSubject || ''}&body=${shareDetails?.emailBody || ''}`}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-purple-800/40 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>Share via Email</span>
                </a>

                {card?.slug && (
                  <Link
                    to={`/card/${card.slug}`}
                    target="_blank"
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl glass-card hover:bg-white/10 text-pink-300 font-semibold text-xs border border-pink-500/30 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Open Recipient Page</span>
                  </Link>
                )}
              </div>
            </div>

            {/* QR Code Card */}
            <div className="glass-card p-5 rounded-2xl border border-purple-800/40 text-center space-y-3">
              <h4 className="text-xs font-bold text-slate-300 flex items-center justify-center gap-1.5">
                <QrCode className="w-4 h-4 text-pink-400" />
                <span>Scan with Camera</span>
              </h4>

              {qrDataUrl ? (
                <div className="bg-white p-3 rounded-xl inline-block shadow-lg">
                  <img src={qrDataUrl} alt="Card QR Code" className="w-32 h-32 mx-auto" />
                </div>
              ) : (
                <div className="w-32 h-32 bg-white/5 rounded-xl mx-auto flex items-center justify-center text-xs text-slate-500">
                  QR loading...
                </div>
              )}

              {qrDataUrl && (
                <a
                  href={qrDataUrl}
                  download={`HeartCraft-QR-${card?.recipient_name || 'Surprise'}.png`}
                  className="inline-flex items-center gap-1.5 text-xs text-pink-400 hover:text-pink-300 font-semibold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download QR Image</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
