import React from 'react';
import { FileText, Sparkles, Wand2 } from 'lucide-react';

export default function LetterEditor({
  message,
  onChangeMessage,
  relationship,
  onChangeRelationship,
  endingMessage,
  onChangeEndingMessage,
  categoryType = 'birthday'
}) {
  const starterTemplates = {
    birthday: [
      {
        title: 'Warm & Loving',
        text: 'Happy Birthday! Another year older, wiser, and even more wonderful. May your year ahead be packed with endless laughter, magical adventures, and your wildest dreams coming true. Thank you for making every day brighter! 🎂✨'
      },
      {
        title: 'Fun & Playful',
        text: 'Happy Birthday to my favorite human! I hope your day is as sweet as the birthday cake and as lit as all these virtual candles. Never stop being the weird, awesome legend that you are!'
      }
    ],
    proposal: [
      {
        title: 'Forever & Always',
        text: 'From the moment you walked into my life, every single day has felt like a fairytale. I cannot imagine a tomorrow without your smile, your laugh, and your hand in mine. Will you do me the honor of being my forever?'
      }
    ],
    anniversary: [
      {
        title: 'Milestone Love',
        text: 'Happy Anniversary, my love! Looking back at every memory we have built together fills my heart with so much gratitude. Here is to all the days we have shared, and the infinite adventures still to come.'
      }
    ],
    sorry: [
      {
        title: 'Sincere & Heartfelt',
        text: 'I am truly sorry from the bottom of my heart. Hurting you was the last thing I ever wanted to do. Your feelings and our bond mean the world to me. Please forgive me and let me make things right.'
      }
    ]
  };

  const currentStarters = starterTemplates[categoryType] || starterTemplates.birthday;

  return (
    <div className="space-y-6">
      {/* Relationship Selector */}
      <div>
        <label className="block text-sm font-semibold text-white mb-2">
          Relationship with Recipient
        </label>
        <div className="flex flex-wrap gap-2">
          {['Friend', 'Soulmate / Partner', 'Bestie', 'Crush', 'Spouse', 'Sibling'].map((rel) => (
            <button
              key={rel}
              type="button"
              onClick={() => onChangeRelationship(rel)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                relationship === rel
                  ? 'bg-pink-500 text-white shadow-glow'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-purple-900/40'
              }`}
            >
              {rel}
            </button>
          ))}
        </div>
      </div>

      {/* Main Letter Content */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-pink-400" />
            Personal Letter & Message
          </label>
          <span className="text-xs text-slate-400">{message?.length || 0} characters</span>
        </div>

        {/* Quick Inspiration Pills */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-pink-300 flex items-center gap-1 font-medium">
            <Wand2 className="w-3 h-3" /> Quick Template:
          </span>
          {currentStarters.map((starter, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onChangeMessage(starter.text)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 border border-pink-500/30 transition-colors"
            >
              {starter.title}
            </button>
          ))}
        </div>

        <textarea
          rows={5}
          value={message}
          onChange={(e) => onChangeMessage(e.target.value)}
          placeholder="Write your personal letter here... It will be revealed inside the surprise experience with elegant calligraphy animation."
          className="w-full rounded-2xl bg-white/5 border border-purple-900/50 p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 leading-relaxed font-sans"
        />
      </div>

      {/* Sign-off / Ending Message */}
      <div>
        <label className="block text-sm font-semibold text-white mb-1">
          Closing Sign-off (Optional)
        </label>
        <input
          type="text"
          value={endingMessage}
          onChange={(e) => onChangeEndingMessage(e.target.value)}
          placeholder="e.g. Always yours with love, Rohan ❤️"
          className="w-full rounded-xl bg-white/5 border border-purple-900/50 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
        />
      </div>
    </div>
  );
}
