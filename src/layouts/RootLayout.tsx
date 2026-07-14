import { useEffect } from 'react';
import { Outlet, useNavigation, useLocation } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ToastContainer } from '@/components/common/ToastContainer';

export function RootLayout() {
  const navigation = useNavigation();
  const location = useLocation();
  const isNavigating = navigation.state === 'loading';

  // Automatically scroll to the top hero section of the page on route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-cream text-brown">
      {isNavigating && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-temple-red/20 z-[9999] overflow-hidden">
          <div 
            className="h-full bg-temple-red rounded-full animate-pulse" 
            style={{
              width: '40%',
              animation: 'loading-bar 1.5s infinite linear',
            }} 
          />
          <style>{`
            @keyframes loading-bar {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(250%); }
            }
          `}</style>
        </div>
      )}
      <Navbar />
      <main className="pt-[120px] md:pt-[132px]">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
}
