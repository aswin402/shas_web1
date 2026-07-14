import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { TrustStrip } from '@/components/common/TrustStrip';
import { useAppStore } from '@/store/useAppStore';
import { supabase } from '@/lib/supabase';

export function AuthPage() {
  const user = useAppStore((state) => state.user);
  const [view, setView] = useState<'login' | 'register'>('login');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [view]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <main className="bg-cream pt-6 pb-0 min-h-screen flex flex-col">
      <div className="max-w-[1400px] mx-auto section-padding w-full flex-1 flex flex-col">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-body uppercase tracking-wider text-muted-brown mb-8 md:mb-12">
          <Link to="/" className="flex items-center gap-1.5 hover:text-temple-red transition-colors">
            <Home className="w-3.5 h-3.5 mb-0.5" />
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-brown font-medium">Account</span>
        </nav>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center mb-16 md:mb-24">
          <div className="w-full max-w-md bg-ivory border border-border/50 rounded-lg p-6 md:p-10 shadow-[0_4px_24px_oklch(0.78_0.045_75/0.25)] relative overflow-hidden">
            {/* Decorative subtle background element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-warm-beige/30 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-warm-beige/30 rounded-full blur-2xl -ml-16 -mb-16 pointer-events-none" />
            
            <div className="relative z-10">
              {user ? (
                <div className="animate-fade-up text-center">
                  <h2 className="text-2xl md:text-3xl font-heading font-semibold text-deep-brown mb-2">
                    My Account
                  </h2>
                  <p className="text-sm font-body text-muted-brown mb-8">
                    Welcome back, {user.name || user.email}!
                  </p>
                  <div className="space-y-4">
                    <p className="text-xs font-body uppercase tracking-wider text-brown">
                      Logged in as: <span className="font-semibold">{user.email}</span>
                    </p>
                    <button
                      onClick={handleLogout}
                      className="w-full h-12 mt-4 bg-temple-red text-cream font-body font-semibold uppercase tracking-[0.12em] text-xs rounded-md hover:bg-deep-red transition-all duration-300 active:scale-[0.98]"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : view === 'login' ? (
                <LoginForm onToggleView={() => setView('register')} />
              ) : (
                <RegisterForm onToggleView={() => setView('login')} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Trust Strip at bottom */}
      <div className="mt-auto">
        <TrustStrip />
      </div>
    </main>
  );
}
