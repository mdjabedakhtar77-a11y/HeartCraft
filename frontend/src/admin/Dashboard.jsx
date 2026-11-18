import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  Shield,
  Gift,
  Eye,
  Users,
  CheckCircle2,
  Loader2,
  Sparkles,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard({ initialTab = 'overview' }) {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [stats, setStats] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/login');
    }
  }, [isAdmin, authLoading, navigate]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, templatesRes, customersRes] = await Promise.all([
        api.getAdminStats(),
        api.getTemplates(),
        api.getAdminCustomers()
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (templatesRes.success) setTemplates(templatesRes.templates || []);
      if (customersRes.success) setCustomers(customersRes.customers || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch admin data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin]);

  const handleToggleTemplate = async (id) => {
    try {
      const res = await api.toggleTemplate(id);
      if (res.success) {
        setTemplates((prev) =>
          prev.map((t) => (t.id === id ? { ...t, is_active: !t.is_active } : t))
        );
      }
    } catch (err) {
      alert(err.message || 'Failed to update template status.');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#0f0717] flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0717] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <Shield className="w-3.5 h-3.5" />
              <span>HeartCraft Admin Command Center</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">Platform Analytics & Management</h1>
            <p className="text-xs text-slate-400 mt-1">
              Signed in as {user?.name} ({user?.email}) • 100% Free Surprise Platform
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-purple-900/40">
            {['overview', 'templates', 'customers'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                  activeTab === tab
                    ? 'bg-pink-600 text-white shadow-glow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs mb-6">
            {error}
          </div>
        )}

        {/* Tab 1: Overview KPIs */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-8 animate-fadeIn">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="glass-panel p-5 rounded-2xl border border-purple-800/40">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-medium">Published Surprises</span>
                  <Gift className="w-4 h-4 text-pink-400" />
                </div>
                <p className="text-2xl font-bold text-white font-mono">{stats.publishedCards}</p>
                <span className="text-[10px] text-emerald-400">Live experiences shared</span>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-purple-800/40">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-medium">Ongoing Drafts</span>
                  <Sparkles className="w-4 h-4 text-purple-400" />
                </div>
                <p className="text-2xl font-bold text-white font-mono">{stats.totalDrafts}</p>
                <span className="text-[10px] text-slate-400">Cards in customization</span>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-purple-800/40">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-medium">Total Views</span>
                  <Eye className="w-4 h-4 text-blue-400" />
                </div>
                <p className="text-2xl font-bold text-white font-mono">{stats.totalViews}</p>
                <span className="text-[10px] text-blue-300">Recipient views tracked</span>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-purple-800/40">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-medium">Registered Creators</span>
                  <Users className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-2xl font-bold text-emerald-400 font-mono">{stats.totalCustomers}</p>
                <span className="text-[10px] text-emerald-300">{stats.completionRate || 100}% completion rate</span>
              </div>
            </div>

            {/* Quick Summary Banner */}
            <div className="glass-card p-6 rounded-3xl border border-pink-500/30 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-pink-400" />
                  <span>Instant Publishing Enabled</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  All surprise experiences are free and publish immediately. No payment barriers or manual verification required.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('templates')}
                className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs shadow-md transition-all"
              >
                Manage Catalog →
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Templates */}
        {activeTab === 'templates' && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-purple-800/40 space-y-6 animate-fadeIn">
            <h3 className="text-lg font-bold text-white">Experience Catalog (100% Free)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((tpl) => (
                <div key={tpl.id} className="glass-card p-5 rounded-2xl border border-purple-800/40 flex flex-col justify-between space-y-4">
                  <div className="flex gap-4">
                    <img src={tpl.preview_image} alt={tpl.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-white">{tpl.name}</h4>
                      <span className="text-xs text-emerald-400 font-semibold">Free Forever</span>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{tpl.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-purple-900/40">
                    <span className="text-xs text-slate-400">
                      Status: <strong className={tpl.is_active ? 'text-emerald-400' : 'text-slate-500'}>
                        {tpl.is_active ? 'Active' : 'Disabled'}
                      </strong>
                    </span>
                    <button
                      onClick={() => handleToggleTemplate(tpl.id)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white"
                    >
                      {tpl.is_active ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Customers */}
        {activeTab === 'customers' && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-purple-800/40 space-y-4 animate-fadeIn">
            <h3 className="text-lg font-bold text-white">Registered Users ({customers.length})</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-slate-400 border-b border-purple-900/40">
                  <tr>
                    <th className="pb-3 font-semibold">User ID</th>
                    <th className="pb-3 font-semibold">Name</th>
                    <th className="pb-3 font-semibold">Email</th>
                    <th className="pb-3 font-semibold">Cards Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-900/20 text-slate-300">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-white/5">
                      <td className="py-3 font-mono text-purple-300">#USR-{c.id}</td>
                      <td className="py-3 font-bold text-white">{c.name}</td>
                      <td className="py-3 text-slate-400">{c.email}</td>
                      <td className="py-3 font-mono">{c.cardCount || c.orderCount || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
