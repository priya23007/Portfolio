import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { navigate } from '../../hooks/useRouter';

export const AdminLoginPage = ({ ownerName }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Signed in. Welcome back.');
    } catch (err) {
      const msg = err.response?.data?.detail || 'Authentication failed. Please verify credentials.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    'w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-100 text-sm placeholder:text-slate-500 focus:outline-none focus:border-neon-cyan/60 focus:ring-2 focus:ring-neon-cyan/15 transition-all';

  return (
    <div className="min-h-screen bg-ink-950 text-slate-800 relative overflow-hidden flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-grid opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-neon-violet/20 blur-[120px]" />

      <div className="relative w-full max-w-md">
        <button
          onClick={() => navigate('/')}
          className="mb-6 inline-flex items-center gap-1.5 text-xs font-mono text-slate-600 hover:text-neon-cyan transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> back to portfolio
        </button>

        <div className="glass-card rounded-2xl p-8">
          <div className="flex items-center gap-3 pb-6 border-b border-slate-200">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-neon-cyan/20 to-neon-violet/20 border border-slate-200 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-neon-cyan" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-900">Admin Console</h1>
              <p className="text-xs text-slate-600 font-mono">{ownerName ? `${ownerName} · restricted access` : 'restricted access'}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-widest text-slate-600 mb-1.5">Email</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className={inputCls}
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-widest text-slate-600 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={inputCls}
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2 disabled:opacity-60">
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-ink-950/30 border-t-ink-950 rounded-full animate-spin" />
                  <span>Verifying…</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
