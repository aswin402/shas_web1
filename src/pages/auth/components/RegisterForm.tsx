import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Lock, Mail, Phone, Eye, EyeOff } from 'lucide-react';

interface RegisterFormProps {
  onToggleView: () => void;
}

export function RegisterForm({ onToggleView }: RegisterFormProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [signupType, setSignupType] = useState<'email' | 'phone'>('email');

  const [usernameError, setUsernameError] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleUsernameBlur = async () => {
    const val = username.trim().toLowerCase();
    if (!val) return;
    
    if (val.length < 3) {
      setUsernameError('Username must be at least 3 characters.');
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(val)) {
      setUsernameError('Letters, numbers, and underscores only.');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', val)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setUsernameError('Username is already taken.');
      } else {
        setUsernameError('');
      }
    } catch (err) {
      // Ignored for UX
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const name = `${firstName} ${lastName}`.trim();
    const cleanUsername = username.trim().toLowerCase();

    // Final username validation check
    if (usernameError) {
      setErrorMsg('Please resolve the username error before submitting.');
      setLoading(false);
      return;
    }

    if (cleanUsername.length < 3 || !/^[a-zA-Z0-9_]+$/.test(cleanUsername)) {
      setErrorMsg('Username must be at least 3 characters and contain alphanumeric/underscores only.');
      setLoading(false);
      return;
    }

    try {
      // Re-verify username availability one last time before API call
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', cleanUsername)
        .maybeSingle();

      if (existingUser) {
        setUsernameError('Username is already taken.');
        throw new Error('Username is already taken. Please choose another one.');
      }

      let signUpParams: any = {
        password,
        options: {
          data: {
            full_name: name,
            username: cleanUsername,
          },
        },
      };

      if (signupType === 'email') {
        signUpParams.email = email.trim();
      } else {
        const cleanPhone = phone.trim().replace(/[^\d+]/g, '');
        if (!/^\+?[0-9]{8,15}$/.test(cleanPhone)) {
          throw new Error('Please enter a valid phone number (e.g. +1234567890).');
        }
        signUpParams.phone = cleanPhone;
      }

      const { error } = await supabase.auth.signUp(signUpParams);
      if (error) throw error;
      setSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create user account.');
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
        Create Account
      </h2>
      <p className="text-sm font-body text-muted-brown text-center mb-8">
        Join SHAS Jewellery for faster checkout and exclusive previews.
      </p>

      {errorMsg && (
        <div className="p-3 bg-clay/10 border border-clay/20 text-clay rounded-md text-sm text-center mb-4 font-semibold">
          {errorMsg}
        </div>
      )}

      {success ? (
        <div className="text-center py-6">
          <div className="w-12 h-12 bg-green-50 border border-green-200 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-heading font-semibold text-deep-brown mb-2">Registration Successful</h3>
          <p className="text-sm font-body text-muted-brown mb-6">
            {signupType === 'email' 
              ? 'Please check your email to confirm your account, then sign in.'
              : 'Your account has been created. You can now log in using your phone number.'}
          </p>
          <button
            onClick={onToggleView}
            className="text-temple-red font-semibold hover:underline text-sm font-body"
          >
            Go to Sign In
          </button>
        </div>
      ) : (
        <>
          {/* Social Signup */}
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
            Sign up with Google
          </button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/60"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-ivory px-2.5 text-muted-brown font-body text-[10px] tracking-widest">Or register with details</span>
            </div>
          </div>

          {/* Signup Tabs */}
          <div className="flex border border-border/60 rounded-md p-1 bg-cream/50 mb-6">
            <button
              type="button"
              onClick={() => { setSignupType('email'); setErrorMsg(''); }}
              className={`flex-1 py-2 text-xs font-body font-semibold uppercase tracking-wider rounded transition-all ${
                signupType === 'email'
                  ? 'bg-temple-red text-cream shadow-sm'
                  : 'text-brown hover:text-temple-red'
              }`}
            >
              Email Signup
            </button>
            <button
              type="button"
              onClick={() => { setSignupType('phone'); setErrorMsg(''); }}
              className={`flex-1 py-2 text-xs font-body font-semibold uppercase tracking-wider rounded transition-all ${
                signupType === 'phone'
                  ? 'bg-temple-red text-cream shadow-sm'
                  : 'text-brown hover:text-temple-red'
              }`}
            >
              Phone Signup
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-xs font-body font-medium uppercase tracking-wider text-brown mb-2">
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[oklch(22.69%_0.076_34.62)]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full h-12 pl-10 pr-4 bg-cream border border-border/60 rounded-md text-sm font-body text-brown focus:border-temple-red focus:ring-1 focus:ring-temple-red outline-none transition-all"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="lastName" className="block text-xs font-body font-medium uppercase tracking-wider text-brown mb-2">
                  Last Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[oklch(22.69%_0.076_34.62)]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full h-12 pl-10 pr-4 bg-cream border border-border/60 rounded-md text-sm font-body text-brown focus:border-temple-red focus:ring-1 focus:ring-temple-red outline-none transition-all"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="register-username" className="block text-xs font-body font-medium uppercase tracking-wider text-brown mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[oklch(22.69%_0.076_34.62)]">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="register-username"
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setUsernameError('');
                  }}
                  onBlur={handleUsernameBlur}
                  className={`w-full h-12 pl-10 pr-4 bg-cream border rounded-md text-sm font-body text-brown focus:ring-1 outline-none transition-all ${
                    usernameError 
                      ? 'border-temple-red focus:border-temple-red focus:ring-temple-red' 
                      : 'border-border/60 focus:border-temple-red focus:ring-temple-red'
                  }`}
                  required
                  placeholder="lowercase_and_underscores"
                  disabled={loading}
                />
              </div>
              {usernameError && (
                <p className="mt-1 text-[11px] font-body text-temple-red">{usernameError}</p>
              )}
            </div>

            {signupType === 'email' ? (
              <div>
                <label htmlFor="register-email" className="block text-xs font-body font-medium uppercase tracking-wider text-brown mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[oklch(22.69%_0.076_34.62)]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="register-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-12 pl-10 pr-4 bg-cream border border-border/60 rounded-md text-sm font-body text-brown focus:border-temple-red focus:ring-1 focus:ring-temple-red outline-none transition-all placeholder:text-brown/35"
                    required
                    placeholder="you@gmail.com"
                    disabled={loading}
                  />
                </div>
              </div>
            ) : (
              <div>
                <label htmlFor="register-phone" className="block text-xs font-body font-medium uppercase tracking-wider text-brown mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[oklch(22.69%_0.076_34.62)]">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    id="register-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-12 pl-10 pr-4 bg-cream border border-border/60 rounded-md text-sm font-body text-brown focus:border-temple-red focus:ring-1 focus:ring-temple-red outline-none transition-all placeholder:text-brown/35"
                    required
                    placeholder="+1234567890"
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="register-password" className="block text-xs font-body font-medium uppercase tracking-wider text-brown mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[oklch(22.69%_0.076_34.62)]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 pl-10 pr-12 bg-cream border border-border/60 rounded-md text-sm font-body text-brown focus:border-temple-red focus:ring-1 focus:ring-temple-red outline-none transition-all placeholder:text-brown/35"
                  required
                  placeholder="Min. 8 characters"
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
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        </>
      )}

      <div className="mt-8 text-center">
        <p className="text-sm font-body text-muted-brown">
          Already have an account?{' '}
          <button
            onClick={onToggleView}
            className="text-temple-red font-semibold hover:underline"
            disabled={loading}
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
