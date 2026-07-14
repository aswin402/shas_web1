import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';
import { Lock, Mail, Loader2, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AdminLoginPage() {
  const user = useAppStore((state) => state.user);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setErrorMsg('Please fill in all fields.');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });
      if (error) throw error;
    } catch (err) {
      const error = err as Error;
      setErrorMsg(error.message || 'Incorrect credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
    } catch (err) {
      const error = err as Error;
      setErrorMsg(error.message || 'Failed to sign out.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main 
      className="min-h-screen w-full flex items-center justify-center bg-cream px-4 py-12 relative overflow-hidden font-body selection:bg-clay/20 selection:text-deep-brown"
    >
      {/* Decorative luxury gradient background accent */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-clay/5 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-deep-brown/5 rounded-full blur-[120px] -ml-64 -mb-64 pointer-events-none" />

      <div className="w-full max-w-md bg-white/95 border border-deep-brown/10 rounded-xl p-8 md:p-10 shadow-[0_8px_32px_rgba(44,14,2,0.08)] backdrop-blur-md relative z-10 animate-fade-up">
        {/* Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-clay/10 text-clay mb-4 border border-clay/20">
            <Lock className="w-5 h-5" />
          </div>
          <h2 className="text-2xl md:text-3xl font-heading font-semibold text-deep-brown tracking-wide">
            SHAS Jewellery
          </h2>
          <p className="text-xs uppercase tracking-widest text-deep-brown/60 mt-1">
            Admin Login
          </p>
        </div>

        {/* Access Denied / Active session feedback */}
        {user && !user.is_admin && (
          <div className="p-4 bg-clay/10 border border-clay/20 text-deep-brown rounded-lg text-sm mb-6 text-center">
            <p className="font-semibold text-clay text-base mb-1">Access Denied</p>
            <p className="text-xs text-deep-brown/80 mb-4">
              Logged in as <span className="font-semibold text-deep-brown">{user.email}</span>, but you do not have administrator privileges.
            </p>
            <button
              onClick={handleSignOut}
              disabled={loading}
              className="px-4 py-2 bg-clay text-white hover:bg-burnt-gold text-xs font-semibold uppercase tracking-wider rounded transition-colors active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Signing Out...' : 'Sign Out & Switch Account'}
            </button>
          </div>
        )}

        {/* Global Error Banner */}
        {errorMsg && (
          <div className="p-3 bg-clay/10 border border-clay/20 text-clay rounded-md text-xs text-center mb-6 font-semibold">
            {errorMsg}
          </div>
        )}

        {/* LoginForm - only visible if not logged in or logged in as non-admin */}
        {(!user || !user.is_admin) && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="admin-email"
                className="block text-xs font-semibold uppercase tracking-wider text-deep-brown/80 mb-2"
              >
                Admin Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-deep-brown">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 pl-10 pr-4 bg-cream border border-deep-brown/15 rounded-md text-sm text-deep-brown focus:border-clay focus:ring-1 focus:ring-clay outline-none transition-all placeholder:text-deep-brown/35"
                  required
                  placeholder="admin@shasjewellery.com"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-semibold uppercase tracking-wider text-deep-brown/80 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-deep-brown">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 pl-10 pr-12 bg-cream border border-deep-brown/15 rounded-md text-sm text-deep-brown focus:border-clay focus:ring-1 focus:ring-clay outline-none transition-all placeholder:text-deep-brown/35"
                  required
                  placeholder="••••••••"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-deep-brown/60 hover:text-deep-brown transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 mt-2 bg-clay text-white font-semibold uppercase tracking-[0.15em] text-xs rounded-md hover:bg-burnt-gold transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                'Access Portal'
              )}
            </button>
          </form>
        )}

        <div className="mt-8 text-center border-t border-deep-brown/10 pt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-clay hover:text-deep-brown transition-colors uppercase tracking-wider font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Return to Store
          </Link>
        </div>
      </div>
    </main>
  );
}
