/**
 * Experience Renderer (Factory & Strategy Pattern)
 * Resolves the appropriate interactive template based on category.
 * Manages Passcode Security Lock & Countdown Guards before rendering.
 */

import React, { useState } from 'react';
import { Lock, Clock, Sparkles, KeyRound } from 'lucide-react';
import BirthdayExperience from './birthday/BirthdayExperience';
import ProposalExperience from './proposal/ProposalExperience';
import AnniversaryExperience from './anniversary/AnniversaryExperience';
import SorryExperience from './sorry/SorryExperience';
import PuzzleExperience from './puzzle/PuzzleExperience';
import FriendshipExperience from './friendship/FriendshipExperience';
import api from '../services/api';
import soundEffects from '../utils/soundEffects';

const EXPERIENCE_MAP = {
  birthday: BirthdayExperience,
  proposal: ProposalExperience,
  anniversary: AnniversaryExperience,
  sorry: SorryExperience,
  puzzle: PuzzleExperience,
  friendship: FriendshipExperience,
  'miss-you': AnniversaryExperience, // Reuses timeline & countdown strategy
  'thank-you': BirthdayExperience
};

export default function ExperienceRenderer({ card: initialCard, isPreview = false }) {
  const [card, setCard] = useState(initialCard);
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState(null);
  const [verifying, setVerifying] = useState(false);

  // If card requires passcode and is still locked
  if (card?.is_passcode_protected) {
    const handleVerifyPasscode = async (e) => {
      e.preventDefault();
      setPasscodeError(null);
      setVerifying(true);
      try {
        const res = await api.verifyPasscode(card.slug, passcode);
        if (res.success && res.card) {
          soundEffects.playCelebrationFanfare();
          setCard(res.card);
        }
      } catch (err) {
        setPasscodeError(err.message || 'Incorrect passcode. Please try again.');
      } finally {
        setVerifying(false);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-b from-[#180a29] via-[#2a103c] to-[#0f041b] text-white flex items-center justify-center p-4">
        <div className="glass-panel p-8 sm:p-10 rounded-3xl max-w-md w-full border border-pink-500/30 shadow-2xl text-center space-y-6 animate-fadeIn">
          <div className="w-16 h-16 rounded-3xl bg-pink-500/20 text-pink-400 border border-pink-500/30 mx-auto flex items-center justify-center">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">This Surprise is Protected</h2>
            <p className="text-xs text-slate-300 mt-2">
              The sender set a private 4-digit passcode for {card.recipient_name}. Enter it below to unlock your experience!
            </p>
          </div>

          <form onSubmit={handleVerifyPasscode} className="space-y-4">
            <input
              type="password"
              maxLength={6}
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="••••"
              className="w-40 mx-auto text-center tracking-[12px] text-2xl font-mono py-3 rounded-2xl bg-white/5 border border-pink-500/50 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              autoFocus
            />

            {passcodeError && (
              <p className="text-xs text-rose-400 font-medium">{passcodeError}</p>
            )}

            <button
              type="submit"
              disabled={verifying || !passcode}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-sm shadow-glow hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all"
            >
              {verifying ? 'Unlocking...' : 'Unlock Experience ✨'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Resolve Template Component
  const categorySlug =
    card?.template?.category_slug ||
    card?.template?.category?.toLowerCase() ||
    'birthday';

  const SelectedExperience = EXPERIENCE_MAP[categorySlug] || BirthdayExperience;

  return <SelectedExperience card={card} isPreview={isPreview} />;
}
