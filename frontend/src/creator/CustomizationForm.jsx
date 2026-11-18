import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Eye, Send, Lock, Clock, Calendar, Cake, Heart, Loader2 } from 'lucide-react';
import StyleSelector from './StyleSelector';
import LetterEditor from './LetterEditor';
import PhotoUploader from './PhotoUploader';
import MusicSelector from './MusicSelector';
import api from '../services/api';

export default function CustomizationForm({ template, categoryType = 'birthday' }) {
  const navigate = useNavigate();

  // Form State
  const [recipientName, setRecipientName] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('galaxy');
  const [cakeDesign, setCakeDesign] = useState('chocolate-stars');
  const [relationship, setRelationship] = useState('Friend');
  const [message, setMessage] = useState('');
  const [endingMessage, setEndingMessage] = useState('');
  const [birthdayDate, setBirthdayDate] = useState('');
  const [music, setMusic] = useState('birthday-acoustic');
  const [enableCountdown, setEnableCountdown] = useState(false);
  const [enablePasscode, setEnablePasscode] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [media, setMedia] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cakeDesigns = [
    { id: 'chocolate-stars', name: 'Dark Chocolate Stars', icon: '🍫' },
    { id: 'strawberry-velvet', name: 'Strawberry Rose Velvet', icon: '🍓' },
    { id: 'vanilla-confetti', name: 'Vanilla Confetti Carnival', icon: '🧁' },
    { id: 'champagne-gold', name: 'Royal Golden Champagne', icon: '✨' }
  ];

  const handleSaveDraft = async (action = 'preview') => {
    if (!recipientName.trim()) {
      setError("Please enter the recipient's name.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        template_id: template?.id || 1,
        recipient_name: recipientName.trim(),
        message,
        relationship,
        birthday_date: birthdayDate || null,
        ending_message: endingMessage,
        extra_data: {
          style: selectedStyle,
          cakeDesign
        },
        music,
        countdown: enableCountdown,
        passcode: enablePasscode ? passcode : null,
        media
      };

      const res = await api.createCardDraft(payload);
      if (res.success && res.card) {
        if (action === 'preview') {
          navigate(`/preview/${res.card.id}`);
        } else {
          // Direct free publishing
          await api.publishCard(res.card.id);
          navigate(`/success/${res.card.id}`);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to save card draft.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-purple-800/40 shadow-2xl max-w-4xl mx-auto space-y-10">
      {/* Header Info */}
      <div className="border-b border-purple-900/40 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-pink-400 uppercase tracking-widest">
            Personalization Studio
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Customize {template?.name || 'Your Surprise Experience'}
          </h2>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold text-sm w-fit">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>100% Free Forever</span>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Recipient Basic Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            Recipient's Name <span className="text-pink-400">*</span>
          </label>
          <input
            type="text"
            required
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            placeholder="e.g. Priya, Rahul, Mom..."
            className="w-full rounded-2xl bg-white/5 border border-purple-900/50 px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-white mb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-pink-400" />
            Special Date (Birthday or Anniversary)
          </label>
          <input
            type="date"
            value={birthdayDate}
            onChange={(e) => setBirthdayDate(e.target.value)}
            className="w-full rounded-2xl bg-white/5 border border-purple-900/50 px-4 py-3 text-sm text-white focus:outline-none focus:border-pink-500"
          />
        </div>
      </div>

      {/* Visual Style Selection */}
      <StyleSelector
        selectedStyle={selectedStyle}
        onSelectStyle={setSelectedStyle}
        styles={template?.styles}
      />

      {/* Cake Design (if birthday) */}
      {categoryType === 'birthday' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-white mb-1 flex items-center gap-2">
              <Cake className="w-4 h-4 text-pink-400" />
              Choose Birthday Cake Design
            </label>
            <p className="text-xs text-slate-400">
              The recipient will blow the candles and slice this cake in the interactive stage!
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {cakeDesigns.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCakeDesign(c.id)}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  cakeDesign === c.id
                    ? 'border-pink-500 bg-pink-500/15 shadow-glow'
                    : 'border-purple-900/40 bg-white/5 hover:border-purple-700'
                }`}
              >
                <span className="text-3xl block mb-1">{c.icon}</span>
                <span className="text-xs font-bold text-white block">{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Letter Editor */}
      <LetterEditor
        message={message}
        onChangeMessage={setMessage}
        relationship={relationship}
        onChangeRelationship={setRelationship}
        endingMessage={endingMessage}
        onChangeEndingMessage={setEndingMessage}
        categoryType={categoryType}
      />

      {/* Photo Uploader */}
      <PhotoUploader media={media} onChangeMedia={setMedia} maxPhotos={4} />

      {/* Music Selector */}
      <MusicSelector selectedMusic={music} onSelectMusic={setMusic} />

      {/* Optional Features: Passcode Lock & Countdown */}
      <div className="space-y-4 pt-4 border-t border-purple-900/40">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Optional Surprise Safeguards
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Passcode Protection Toggle */}
          <div className="glass-card p-4 rounded-2xl border border-purple-800/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-pink-400" />
                <span className="text-sm font-semibold text-white">4-Digit Passcode Lock</span>
              </div>
              <input
                type="checkbox"
                checked={enablePasscode}
                onChange={(e) => setEnablePasscode(e.target.checked)}
                className="w-4 h-4 accent-pink-500 cursor-pointer"
              />
            </div>
            {enablePasscode && (
              <input
                type="password"
                maxLength={4}
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Set 4-digit PIN (e.g. 1234)"
                className="w-full text-center tracking-widest font-mono text-sm rounded-xl bg-white/5 border border-pink-500/40 py-2 text-white focus:outline-none"
              />
            )}
          </div>

          {/* Countdown Timer Toggle */}
          <div className="glass-card p-4 rounded-2xl border border-purple-800/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-pink-400" />
              <div>
                <span className="text-sm font-semibold text-white block">Event Countdown</span>
                <span className="text-[11px] text-slate-400">Display live countdown timer</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={enableCountdown}
              onChange={(e) => setEnableCountdown(e.target.checked)}
              className="w-4 h-4 accent-pink-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons: Preview & Direct Publish */}
      <div className="pt-6 border-t border-purple-900/40 flex flex-col sm:flex-row items-center justify-end gap-4">
        <button
          type="button"
          disabled={loading}
          onClick={() => handleSaveDraft('preview')}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl glass-card hover:bg-white/10 text-white font-semibold text-sm border border-purple-600/40 transition-all"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4 text-pink-400" />}
          <span>Preview Surprise</span>
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={() => handleSaveDraft('publish')}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-bold text-sm shadow-glow hover:brightness-110 active:scale-95 transition-all"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          <span>Publish & Share Instantly (Free)</span>
        </button>
      </div>
    </div>
  );
}
