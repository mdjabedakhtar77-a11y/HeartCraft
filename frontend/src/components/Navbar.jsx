import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Sparkles, Menu, X, Shield, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin, logout } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Experiences', path: '/experiences' },
    { name: 'Birthday', path: '/birthday' },
    { name: 'Proposal', path: '/proposal' },
    { name: 'Anniversary', path: '/anniversary' },
    { name: 'Sorry', path: '/sorry' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-purple-900/40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-600 via-rose-500 to-purple-600 flex items-center justify-center shadow-glow group-hover:scale-105 transition-all duration-300">
              <Heart className="w-6 h-6 text-white fill-white animate-pulse" />
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-pink-200 to-purple-300 bg-clip-text text-transparent">
                HeartCraft
              </span>
              <p className="text-[10px] text-pink-300/80 tracking-widest uppercase font-medium">Digital Surprises</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'text-pink-400 bg-pink-500/10 shadow-sm border border-pink-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Action CTAs & Auth */}
          <div className="hidden md:flex items-center gap-4">
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30 transition-all"
              >
                <Shield className="w-3.5 h-3.5" />
                Admin Panel
              </Link>
            )}

            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-300 font-medium">Hi, {user.name.split(' ')[0]}</span>
                <button
                  onClick={logout}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-xs font-medium text-slate-300 hover:text-pink-300 transition-colors"
              >
                Sign In
              </Link>
            )}

            <Link
              to="/experiences"
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white text-sm font-semibold shadow-glow hover:shadow-pink-500/50 hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <Sparkles className="w-4 h-4" />
              <span>Create Surprise</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white/5 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-purple-900/50 px-4 pt-2 pb-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-xl text-base font-medium ${
                isActive(link.path)
                  ? 'text-pink-400 bg-pink-500/10'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-purple-900/40 flex flex-col gap-3">
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-purple-500/20 text-purple-300 text-sm font-medium"
              >
                <Shield className="w-4 h-4" />
                Admin Panel
              </Link>
            )}
            {user ? (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 text-slate-300 text-sm"
              >
                <LogOut className="w-4 h-4" />
                Sign Out ({user.name})
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center py-2.5 rounded-xl bg-white/5 text-slate-300 text-sm"
              >
                Sign In
              </Link>
            )}
            <Link
              to="/experiences"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold shadow-glow"
            >
              <Sparkles className="w-4 h-4" />
              Create Surprise
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
