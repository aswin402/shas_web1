import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { supabase } from '@/lib/supabase';
import { 
  LayoutDashboard, 
  Package, 
  MessageSquare, 
  LogOut, 
  ChevronLeft, 
  ChevronRight, 
  Menu, 
  X,
  ShoppingBag
} from 'lucide-react';

export function AdminLayout() {
  const user = useAppStore((state) => state.user);
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await supabase.auth.signOut();
      navigate('/admin-dashboard'); // Will trigger guard redirect to login
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const navItems = [
    { label: 'Dashboard', to: '/admin-dashboard', icon: LayoutDashboard, end: true },
    { label: 'Products', to: '/admin-dashboard/products', icon: Package },
    { label: 'Orders', to: '/admin-dashboard/orders', icon: ShoppingBag },
    { label: 'Messages', to: '/admin-dashboard/messages', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen flex bg-admin-bg text-deep-brown font-body relative overflow-hidden">
      {/* Background Accent Gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-temple-red/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-terracotta/5 rounded-full blur-[120px] pointer-events-none" />

      {/* --- DESKTOP SIDEBAR --- */}
      <aside 
        className={`hidden md:flex flex-col bg-dark-luxury-light/95 border-r border-border-light/10 transition-all duration-300 relative z-30 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-border-light/5">
          {!isCollapsed && (
            <span className="font-heading font-semibold text-lg tracking-wider text-cream">
              SHAS Jewellery <span className="text-xs uppercase text-clay tracking-widest block font-body font-normal">Portal</span>
            </span>
          )}
          {isCollapsed && (
            <span className="font-heading font-semibold text-xl text-clay mx-auto">S</span>
          )}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-md hover:bg-dark-luxury text-sand hover:text-cream transition-colors absolute -right-3 top-7 bg-dark-luxury-light border border-border-light/10"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className={`flex-1 py-6 space-y-2 ${isCollapsed ? 'px-3' : 'px-4'}`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center rounded-lg transition-all duration-200 group text-sm font-medium ${
                    isCollapsed ? 'justify-center p-3' : 'gap-4 px-4 py-3'
                  } ${
                    isActive 
                      ? 'bg-clay text-white font-semibold shadow-md' 
                      : 'text-sand hover:text-cream hover:bg-dark-luxury'
                  }`
                }
              >
                <Icon className="w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
                {!isCollapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Admin Profile & Logout Block */}
        <div className="p-4 border-t border-border-light/5 bg-dark-luxury/30">
          {!isCollapsed && user && (
            <div className="mb-4 px-2">
              <p className="text-xs text-clay font-semibold uppercase tracking-wider">Signed In As</p>
              <p className="text-sm font-semibold truncate text-cream">{user.name || 'Administrator'}</p>
              <p className="text-xs truncate text-sand/70">{user.email}</p>
            </div>
          )}
          
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`w-full flex items-center justify-center gap-3 rounded-lg bg-clay/10 border border-clay/20 text-cream hover:bg-clay text-sm font-semibold uppercase tracking-wider transition-all duration-200 disabled:opacity-50 ${
              isCollapsed ? 'p-3' : 'px-4 py-3'
            }`}
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
            {!isCollapsed && <span>{isLoggingOut ? 'Logging Out...' : 'Log Out'}</span>}
          </button>
        </div>
      </aside>

      {/* --- MOBILE NAVBAR --- */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden h-16 flex items-center justify-between px-6 bg-dark-luxury-light/95 border-b border-border-light/10 relative z-30">
          <span className="font-heading font-semibold text-lg tracking-wider text-cream">
            SHAS Jewellery <span className="text-xs font-body font-normal text-clay ml-1 font-bold">Admin</span>
          </span>
          <button 
            onClick={() => setIsMobileOpen(true)}
            className="p-2 rounded-md text-sand hover:text-cream hover:bg-dark-luxury transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Mobile Sidebar Drawer Overlay */}
        {isMobileOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        {/* Mobile Drawer */}
        <aside 
          className={`md:hidden fixed top-0 bottom-0 left-0 w-72 bg-dark-luxury-light border-r border-border-light/10 z-50 p-6 flex flex-col justify-between transition-transform duration-300 transform ${
            isMobileOpen ? 'translate-x-0 pointer-events-auto' : '-translate-x-full pointer-events-none invisible'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-8">
              <span className="font-heading font-semibold text-lg tracking-wider text-cream">
                SHAS Jewellery <span className="text-xs uppercase text-clay tracking-widest block font-body font-normal">Portal</span>
              </span>
              <button 
                onClick={() => setIsMobileOpen(false)}
                className="p-1 rounded-md hover:bg-dark-luxury text-sand hover:text-cream transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.label}
                    to={item.to}
                    end={item.end}
                    onClick={() => setIsMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium ${
                        isActive 
                          ? 'bg-temple-red text-cream font-semibold shadow-md' 
                          : 'text-sand hover:text-cream hover:bg-dark-luxury'
                      }`
                    }
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          <div className="border-t border-border-light/5 pt-6 bg-dark-luxury/30 -mx-6 px-6 -mb-6 pb-6">
            {user && (
              <div className="mb-4">
                <p className="text-xs text-clay font-semibold uppercase tracking-wider">Signed In As</p>
                <p className="text-sm font-semibold truncate text-cream">{user.name || 'Administrator'}</p>
                <p className="text-xs truncate text-sand/70">{user.email}</p>
              </div>
            )}
            
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-temple-red/10 border border-temple-red/20 text-cream hover:bg-temple-red text-sm font-semibold uppercase tracking-wider transition-all duration-200 disabled:opacity-50"
            >
              <LogOut className="w-4 h-4" />
              <span>{isLoggingOut ? 'Logging Out...' : 'Log Out'}</span>
            </button>
          </div>
        </aside>

        {/* Content Container */}
        <main className="flex-1 overflow-y-auto px-6 py-8 md:p-10 relative z-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
