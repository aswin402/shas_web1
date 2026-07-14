import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Lock, Eye, EyeOff } from 'lucide-react';

interface LoginFormProps {
  onToggleView: () => void;
}

export function LoginForm({ onToggleView }: LoginFormProps) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const trimmedId = identifier.trim();
    if (!trimmedId) {
      setErrorMsg('Please enter your email, phone, or username.');
      setLoading(false);
      return;
    }

    try {
      let loginParams: { email?: string; phone?: string; password: string } = { password };

      // Identify type of input
      if (trimmedId.includes('@')) {
        loginParams.email = trimmedId;
      } else if (/^\+?[0-9\s\-()]{8,20}$/.test(trimmedId)) {
        // Stripping non-numeric characters (except leading +) for cleaner API matching
        const cleanPhone = trimmedId.replace(/[^\d+]/g, '');
        loginParams.phone = cleanPhone;
      } else {
        // Assume username lookup in profiles
        const { data: profile, error: dbError } = await supabase
          .from('profiles')
          .select('email, phone')
          .eq('username', trimmedId.toLowerCase())
          .maybeSingle();

        if (dbError) throw dbError;
        if (!profile) {
          throw new Error('Username not found. Please check your username or use email/phone.');
        }

        if (profile.email) {
          loginParams.email = profile.email;
        } else if (profile.phone) {
          loginParams.phone = profile.phone;
        } else {
          throw new Error('No login method associated with this username.');
        }
      }

      const { error } = await supabase.auth.signInWithPassword(loginParams as any);
      if (error) throw error;
    } catch (err: any) {
      setErrorMsg(err.message || 'Incorrect credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg('');
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to authenticate with Google.');
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-up">
      <h2 className="text-2xl md:text-3xl font-heading font-semibold text-deep-brown mb-2 text-center">
        Welcome Back
      </h2>
      <p className="text-sm font-body text-muted-brown text-center mb-8">
        Sign in to access your orders and wishlist.
      </p>

      {errorMsg && (
        <div className="p-3 bg-temple-red/10 border border-temple-red/20 text-temple-red rounded-md text-sm text-center mb-4">
          {errorMsg}
        </div>
      )}

      {/* Social Login Button */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full h-12 flex items-center justify-center bg-cream border border-border/60 rounded-md hover:bg-warm-beige/20 transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-brown font-body font-semibold text-xs uppercase tracking-wider mb-6"
      >
        <svg className="w-4 h-4 mr-2.5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continue with Google
      </button>

      {/* Divider */}
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border/60"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-ivory px-2.5 text-muted-brown font-body text-[10px] tracking-widest">Or login with</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="identifier" className="block text-xs font-body font-medium uppercase tracking-wider text-brown mb-2">
            Username, Email, or Phone
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[oklch(22.69%_0.076_34.62)]">
              <User className="w-4 h-4" />
            </div>
            <input
              id="identifier"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full h-12 pl-10 pr-4 bg-cream border border-border/60 rounded-md text-sm font-body text-brown focus:border-temple-red focus:ring-1 focus:ring-temple-red outline-none transition-all placeholder:text-brown/35"
              required
              placeholder="Username, email, or +1234567890"
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="password" className="block text-xs font-body font-medium uppercase tracking-wider text-brown">
              Password
            </label>
            <button type="button" onClick={(e) => e.preventDefault()} className="text-xs font-body text-temple-red hover:underline" disabled={loading}>
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[oklch(22.69%_0.076_34.62)]">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 pl-10 pr-12 bg-cream border border-border/60 rounded-md text-sm font-body text-brown focus:border-temple-red focus:ring-1 focus:ring-temple-red outline-none transition-all placeholder:text-brown/35"
              required
              placeholder="••••••••"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[oklch(22.69%_0.076_34.62)]/60 hover:text-[oklch(22.69%_0.076_34.62)] transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 mt-4 bg-temple-red text-cream font-body font-semibold uppercase tracking-[0.12em] text-xs rounded-md hover:bg-deep-red transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm font-body text-muted-brown">
          Don't have an account?{' '}
          <button
            onClick={onToggleView}
            className="text-temple-red font-semibold hover:underline"
            disabled={loading}
          >
            Create one
          </button>
        </p>
      </div>
    </div>
  );
}
