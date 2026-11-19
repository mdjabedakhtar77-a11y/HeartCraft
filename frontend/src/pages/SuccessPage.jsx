import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Share2, 
  Copy, 
  Check, 
  MessageCircle, 
  Mail, 
  ExternalLink, 
  QrCode, 
  Download, 
  Sparkles,
  Smartphone,
  Send,
  Heart
} from 'lucide-react';
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

          // Get Share URLs with origin hint
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

  // Always compute the real, live URL based on current browser origin!
  const liveCardUrl = card?.slug 
    ? `${window.location.origin}/card/${card.slug}` 
    : (shareDetails?.cardUrl || '');

  const recipientName = card?.recipient_name || 'My Friend';

  const shareText = `✨ Hey ${recipientName}! I created an interactive surprise just for you on HeartCraft ❤️ Open it here:\n${liveCardUrl}`;

  const handleCopyLink = () => {
    if (liveCardUrl) {
      navigator.clipboard.writeText(liveCardUrl);
      soundEffects.playPop();
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Special Surprise for ${recipientName}! ❤️`,
          text: `✨ Hey ${recipientName}! I made a special digital surprise just for you on HeartCraft ❤️ Open it here:`,
          url: liveCardUrl
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
  const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(liveCardUrl)}&text=${encodeURIComponent(`✨ Special surprise for you, ${recipientName}! ❤️`)}`;
  const smsShareUrl = `sms:?&body=${encodeURIComponent(shareText)}`;
  const emailShareUrl = `mailto:?subject=${encodeURIComponent(`A special surprise for you, ${recipientName}! ❤️`)}&body=${encodeURIComponent(`Hey ${recipientName},\n\nI created something special for you on HeartCraft. Click the link below to experience your digital surprise:\n\n${liveCardUrl}\n\nWith love!`)}`;

  return (
    <div className="min-h-screen bg-[#0f0717] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 pt-32 pb-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-pink-500/30 text-center space-y-8 animate-fadeIn">
          {/* Success Check Icon */}
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mx-auto flex items-center justify-center animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Published & Free Forever
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white mt-1 font-display">
              Your Surprise Is Live! 🎉
            </h1>
            <p className="text-sm text-slate-300 mt-2 max-w-md mx-auto">
              The surprise card for <span className="text-pink-400 font-bold">{recipientName}</span> is ready to send. Your friend can open it instantly on any phone or computer without needing an app or account!
            </p>
          </div>

          {/* Primary Quick Share Bar (Native Share Sheet for Mobile) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleNativeShare}
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-sm shadow-glow hover:scale-105 active:scale-95 transition-all"
            >
              <Smartphone className="w-5 h-5" />
              <span>Share Directly to WhatsApp / Friends 📲</span>
            </button>

            {card?.slug && (
              <Link
                to={`/card/${card.slug}`}
                target="_blank"
                className="w-full sm:w-auto flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl glass-card hover:bg-white/10 text-pink-300 font-bold text-xs border border-pink-500/30 transition-all hover:scale-105"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Test Friend's View 👁️</span>
              </Link>
            )}
          </div>

          {/* Share Link Box */}
          <div className="glass-card p-4 rounded-2xl border border-purple-800/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
            <div className="truncate w-full sm:w-auto flex-1 font-mono text-xs text-pink-300 bg-black/40 px-3 py-2.5 rounded-xl border border-purple-900/40 select-all">
              {liveCardUrl || `Loading unique link...`}
            </div>

            <button
              onClick={handleCopyLink}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-semibold text-xs shadow-md transition-all active:scale-95 shrink-0"
            >
              {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard! 🎉' : 'Copy Link'}</span>
            </button>
          </div>

          {/* 1-Tap Sharing Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-purple-900/40 text-left">
            {/* Social Share Buttons */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Share2 className="w-4 h-4 text-pink-400" />
                <span>One-Tap Quick Send</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* WhatsApp */}
                <a
                  href={whatsappShareUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-black font-bold text-xs shadow-md transition-transform hover:scale-105"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>

                {/* Telegram */}
                <a
                  href={telegramShareUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#0088cc] hover:bg-[#0077b5] text-white font-bold text-xs shadow-md transition-transform hover:scale-105"
                >
                  <Send className="w-4 h-4" />
                  <span>Telegram</span>
                </a>

                {/* SMS / Messages */}
                <a
                  href={smsShareUrl}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-purple-800/40 transition-colors"
                >
                  <Smartphone className="w-4 h-4 text-pink-400" />
                  <span>SMS Message</span>
                </a>

                {/* Email */}
                <a
                  href={emailShareUrl}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-purple-800/40 transition-colors"
                >
                  <Mail className="w-4 h-4 text-purple-400" />
                  <span>Email</span>
                </a>
              </div>

              {/* How Friend Sees It Hint */}
              <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-800/30 text-xs text-slate-300 space-y-1.5">
                <p className="font-bold text-pink-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>How it works for your friend:</span>
                </p>
                <ol className="list-decimal list-inside space-y-1 text-slate-400">
                  <li>They click the link you send.</li>
                  <li>The surprise opens directly in their browser.</li>
                  <li>No account or login required!</li>
                </ol>
              </div>
            </div>

            {/* QR Code Card */}
            <div className="glass-card p-5 rounded-2xl border border-purple-800/40 text-center space-y-3 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-300 flex items-center justify-center gap-1.5">
                  <QrCode className="w-4 h-4 text-pink-400" />
                  <span>Scan QR with Phone Camera</span>
                </h4>
                <p className="text-[11px] text-slate-400 mt-1">
                  Point any phone camera to instantly open the surprise.
                </p>
              </div>

              <div className="my-2">
                {qrDataUrl ? (
                  <div className="bg-white p-3 rounded-2xl inline-block shadow-lg">
                    <img src={qrDataUrl} alt="Card QR Code" className="w-32 h-32 mx-auto" />
                  </div>
                ) : (
                  <div className="w-32 h-32 bg-white/5 rounded-2xl mx-auto flex items-center justify-center text-xs text-slate-500">
                    Generating QR...
                  </div>
                )}
              </div>

              {qrDataUrl && (
                <a
                  href={qrDataUrl}
                  download={`HeartCraft-QR-${recipientName.replace(/\s+/g, '_')}.png`}
                  className="inline-flex items-center justify-center gap-1.5 text-xs text-pink-400 hover:text-pink-300 font-semibold py-1.5 px-3 rounded-xl bg-pink-500/10 border border-pink-500/20"
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
