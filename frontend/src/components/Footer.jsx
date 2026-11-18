import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, MessageCircle, Mail, Globe, Share2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-purple-900/40 bg-[#0d0515] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-pink-600/10 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-600 to-purple-600 flex items-center justify-center shadow-glow">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white via-pink-200 to-purple-300 bg-clip-text text-transparent">
                HeartCraft
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Make every moment unforgettable. Create interactive digital experiences, personalized surprise cards, and unforgettable emotional memories for the ones you love most.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-9 h-9 rounded-xl bg-white/5 hover:bg-pink-500/20 text-slate-400 hover:text-pink-400 flex items-center justify-center transition-all">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-white/5 hover:bg-pink-500/20 text-slate-400 hover:text-pink-400 flex items-center justify-center transition-all">
                <Share2 className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Surprise Categories */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Surprises</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link to="/birthday" className="hover:text-pink-400 transition-colors">Birthday Wishes</Link></li>
              <li><Link to="/proposal" className="hover:text-pink-400 transition-colors">Romantic Proposal</Link></li>
              <li><Link to="/anniversary" className="hover:text-pink-400 transition-colors">Anniversary Love</Link></li>
              <li><Link to="/sorry" className="hover:text-pink-400 transition-colors">Heartfelt Apology</Link></li>
              <li><Link to="/puzzle" className="hover:text-pink-400 transition-colors">Photo Puzzle</Link></li>
              <li><Link to="/friendship" className="hover:text-pink-400 transition-colors">Friendship Wall</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link to="/experiences" className="hover:text-pink-400 transition-colors">All Templates</Link></li>
              <li><a href="#how-it-works" className="hover:text-pink-400 transition-colors">How It Works</a></li>
              <li><a href="#reviews" className="hover:text-pink-400 transition-colors">Real Reviews</a></li>
              <li><Link to="/admin" className="hover:text-pink-400 transition-colors">Admin Portal</Link></li>
              <li><Link to="/login" className="hover:text-pink-400 transition-colors">Creator Login</Link></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Support</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-pink-400 shrink-0" />
                <span>support@heartcraft.com</span>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-pink-400 shrink-0" />
                <span>24/7 WhatsApp Support</span>
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-pink-400 shrink-0" />
                <span>Instant Digital Delivery</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-purple-900/30 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} HeartCraft. All rights reserved. Crafted with love.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
