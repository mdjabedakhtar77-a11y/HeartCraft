import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Heart, Lock, Mail, Sparkles, ArrowRight, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        if (res.user?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/experiences');
        }
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillAdminCredentials = () => {
    setEmail('admin@heartcraft.com');
    setPassword('Admin@123');
  };

  const fillDemoCustomer = () => {
    setEmail('sarah@example.com');
    setPassword('Secret@123');
  };

  return (
    <div className="min-h-screen bg-[#0f0717] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 pt-32 pb-20 max-w-md mx-auto px-4 w-full">
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-purple-800/40 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-600 to-purple-600 mx-auto flex items-center justify-center shadow-glow">
              <Heart className="w-6 h-6 text-white fill-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
            <p className="text-xs text-slate-400">Sign in to manage your cards or access the admin panel</p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-purple-900/50 text-xs text-white focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-purple-900/50 text-xs text-white focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs shadow-glow hover:brightness-110 active:scale-95 transition-all"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Quick Demo Fill Buttons */}
          <div className="pt-4 border-t border-purple-900/40 space-y-2">
            <p className="text-[11px] text-slate-400 text-center font-medium">Quick Credentials for Testing:</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={fillAdminCredentials}
                className="flex-1 py-1.5 px-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[11px] font-semibold flex items-center justify-center gap-1"
              >
                <Shield className="w-3 h-3" /> Admin
              </button>
              <button
                type="button"
                onClick={fillDemoCustomer}
                className="flex-1 py-1.5 px-2 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 border border-pink-500/30 text-[11px] font-semibold flex items-center justify-center gap-1"
              >
                Customer Demo
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-pink-400 hover:underline font-semibold">
              Create an account
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
