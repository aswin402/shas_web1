import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, User, Heart, ShoppingBag, Menu, X, ChevronDown, Truck, ShieldCheck } from 'lucide-react';
import { navLinks } from '@/data/navigation';
import { useAppStore } from '@/store/useAppStore';
import shasLogo from '@/assets/shaslogo.png';

export function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();

  const cart = useAppStore((state) => state.cart);
  const wishlist = useAppStore((state) => state.wishlist);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlist.length;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileOpen]);

  const handleDropdownEnter = (label: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(label);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => setActiveDropdown(null), 150);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-cream/95 backdrop-blur-md shadow-[0_1px_12px_rgba(42,32,32,0.08)]'
            : 'bg-cream'
        }`}
      >
        {/* Top Utility Bar */}
        <div className="bg-primary text-[9px] md:text-[10px] py-2.5 text-cream/90 text-center font-body font-bold tracking-[0.12em] uppercase border-b border-white/5">
          <div className="max-w-[1400px] mx-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-1.5 px-4">
            <span className="flex items-center gap-1.5"><Truck className="w-3.5 h-3.5 text-clay" /> Free Insured Shipping</span>
            <span className="hidden sm:inline text-clay/40">|</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-clay" /> Hallmarked Jewellery</span>
            <span className="hidden sm:inline text-clay/40">|</span>
            <span className="flex items-center gap-1.5"><Heart className="w-3.5 h-3.5 text-clay" /> Lifetime Plating Warranty</span>
            <span className="hidden sm:inline text-clay/40">|</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-clay" /> Secure Payments</span>
          </div>
        </div>

        <div className="border-b border-border/40">
          <div className="max-w-[1400px] mx-auto flex items-center justify-between h-24 md:h-[104px] section-padding">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center hover:opacity-90 transition-opacity duration-200 shrink-0"
            >
              <img
                src={shasLogo}
                alt="SHAS Jewellery Logo"
                className="h-16 md:h-22 w-auto object-contain"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-7 xl:gap-9">
              {navLinks.map((link) => (
                <div
                   key={link.label}
                   className="relative"
                   onMouseEnter={() => link.children && handleDropdownEnter(link.label)}
                   onMouseLeave={() => link.children && handleDropdownLeave()}
                >
                  <Link
                    to={link.href}
                    className={`nav-link flex items-center gap-1 py-2 ${location.pathname === link.href ? '!text-temple-red border-b-2 border-temple-red' : ''}`}
                  >
                    {link.label}
                    {link.children && (
                      <ChevronDown
                        className={`w-3 h-3 transition-transform duration-200 ${
                          activeDropdown === link.label ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </Link>

                  {/* Dropdown */}
                  {link.children && activeDropdown === link.label && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2">
                      <div className="min-w-[220px] bg-white border border-border rounded-lg shadow-[0_8px_32px_rgba(42,32,32,0.1)] py-2 animate-fade-up">
                        {link.children.map((child) => (
                          <Link
                            key={child.label}
                            to={child.href}
                            className="block px-5 py-2.5 text-sm font-body text-brown hover:bg-cream hover:text-temple-red transition-colors duration-150"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-1 md:gap-3">
              <Link
                to="/search"
                aria-label="Search"
                className="flex w-8 h-8 md:w-9 md:h-9 items-center justify-center rounded-full text-muted-brown hover:text-temple-red hover:bg-cream transition-all duration-200"
              >
                <Search className="w-[18px] h-[18px]" />
              </Link>
              <Link
                to="/account"
                aria-label="Account"
                className="flex w-8 h-8 md:w-9 md:h-9 items-center justify-center rounded-full text-muted-brown hover:text-temple-red hover:bg-cream transition-all duration-200"
              >
                <User className="w-[18px] h-[18px]" />
              </Link>
              <Link
                to="/wishlist"
                aria-label="Wishlist"
                className="relative w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-full text-muted-brown hover:text-temple-red hover:bg-cream transition-all duration-200"
              >
                <Heart className="w-[18px] h-[18px]" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-clay text-white text-[9px] font-bold flex items-center justify-center shadow-sm">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link
                to="/cart"
                aria-label="Cart"
                className="relative w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-full text-muted-brown hover:text-temple-red hover:bg-cream transition-all duration-200"
              >
                <ShoppingBag className="w-[18px] h-[18px]" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-clay text-white text-[9px] font-bold flex items-center justify-center shadow-sm">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile Hamburger */}
              <button
                aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="lg:hidden w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-full text-brown hover:bg-cream transition-all duration-200 ml-1"
              >
                {isMobileOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-dark-luxury/30 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="absolute top-[96px] md:top-[104px] right-0 w-full sm:w-80 h-[calc(100dvh-96px)] md:h-[calc(100dvh-104px)] bg-white border-l border-border overflow-y-auto">
            <div className="p-6 space-y-1">
              {navLinks.map((link) => (
                <div key={link.label}>
                  <Link
                    to={link.href}
                    onClick={() => !link.children && setIsMobileOpen(false)}
                    className={`block py-3 text-sm font-body font-medium uppercase tracking-[0.12em] hover:text-temple-red transition-colors ${location.pathname === link.href ? 'text-temple-red' : 'text-brown'}`}
                  >
                    {link.label}
                  </Link>
                  {link.children && (
                    <div className="pl-4 pb-2 space-y-1">
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          to={child.href}
                          onClick={() => setIsMobileOpen(false)}
                          className="block py-2 text-sm text-muted-brown hover:text-temple-red transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
