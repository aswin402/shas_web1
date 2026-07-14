import { Link } from 'react-router-dom';
import { Globe, Heart, MessageCircle, Play, Mail, Phone, MapPin } from 'lucide-react';
import { footerColumns } from '@/data/navigation';
import footerBgDesktop from '@/assets/shasfooterdesktop.png';
import footerBgMobile from '@/assets/shasfootermob.png';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-dark-luxury text-cream/90 overflow-hidden w-full">
      {/* Background Images - Stretched 100% to match container bounds */}
      <div
        className="absolute inset-0 bg-no-repeat hidden md:block select-none pointer-events-none"
        style={{
          backgroundImage: `url(${footerBgDesktop})`,
          backgroundSize: '100% 100%',
          backgroundPosition: 'left top'
        }}
      />
      <div
        className="absolute inset-0 bg-no-repeat md:hidden select-none pointer-events-none"
        style={{
          backgroundImage: `url(${footerBgMobile})`,
          backgroundSize: '100% 100%',
          backgroundPosition: 'left top'
        }}
      />

      {/* Main Content Container - Viewport relative spacing */}
      <div className="relative z-10 w-full px-[6vw] lg:px-[8vw] pt-[5.5vw] md:pt-[4.5vw] pb-[3vw] md:pb-[3.5vw]">
        
        {/* Top Section: Brand & Links */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-8 justify-between">
          
          {/* Brand Column - Centered on mobile, left-aligned on desktop */}
          <div className="w-full lg:w-[40%] space-y-[4vw] md:space-y-[2vw] pt-[45vw] lg:pt-[4.5vw] md:pt-[4.5vw] flex flex-col items-center lg:items-start text-center lg:text-left">
            <p className="text-xs md:text-sm leading-relaxed text-sand/80 max-w-md font-body px-4 lg:px-0">
              Timeless by Tradition. Handcrafted heritage and bridal jewellery designed to celebrate life's most precious moments. Hallmarked gold, silver, and temple collections.
            </p>

            {/* Newsletter Subscription */}
            <div className="w-full max-w-md space-y-2.5 px-4 lg:px-0">
              <label
                htmlFor="footer-email"
                className="text-[10px] md:text-xs uppercase font-body font-semibold tracking-wider text-sand block"
              >
                Subscribe to our newsletter
              </label>
              <div className="relative flex items-center max-w-sm mx-auto lg:mx-0">
                <input
                  id="footer-email"
                  type="email"
                  placeholder="Your email address"
                  className="w-full bg-white/5 border border-sand/20 rounded-md py-2 px-3 md:py-2.5 md:pl-4 md:pr-12 text-xs md:text-sm text-cream focus:outline-none focus:border-clay placeholder:text-sand/30"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="absolute right-1 w-8 h-8 md:w-9 md:h-9 rounded bg-clay hover:bg-burnt-gold text-white flex items-center justify-center transition-colors font-bold text-sm"
                >
                  →
                </button>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center justify-center lg:justify-start gap-3 pt-1">
              {[
                { icon: Globe, label: 'Instagram', url: '#' },
                { icon: Heart, label: 'Facebook', url: 'https://www.facebook.com/people/Shas-Jewellers/61589777022840/?ref=NONE_xav_ig_profile_page_web' },
                { icon: MessageCircle, label: 'Twitter', url: '#' },
                { icon: Play, label: 'YouTube', url: '#' },
              ].map(({ icon: Icon, label, url }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-full border border-sand/20 text-sand/60 hover:bg-clay hover:border-clay hover:text-white transition-all duration-200"
                >
                  <Icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Divider between Brand & Links (Mobile Only) */}
          <div className="flex items-center gap-4 my-2 select-none lg:hidden w-full">
            <div className="h-[1px] bg-white/10 flex-1" />
            <div className="flex items-center gap-1.5 text-clay/70">
              <span className="text-[6px]">♦</span>
              <span className="text-xs">✦</span>
              <span className="text-[6px]">♦</span>
            </div>
            <div className="h-[1px] bg-white/10 flex-1" />
          </div>

          {/* Link Columns - Side-by-side grid of 3 columns on both mobile and desktop */}
          <div className="w-full lg:w-[55%] grid grid-cols-3 gap-2 md:gap-6 pt-4 lg:pt-[6vw] md:pt-[6vw]">
            {footerColumns.map((column) => {
              const isSupport = column.title === 'Support';
              const isCollections = column.title === 'Collections';
              return (
                <div
                  key={column.title}
                  className={`space-y-4 md:space-y-[1.5vw] ${
                    isSupport ? 'lg:-ml-[4vw] lg:pr-[2vw]' :
                    isCollections ? 'lg:-ml-[2vw]' : ''
                  }`}
                >
                  <div>
                    <h4 className="text-[9px] min-[375px]:text-[10px] md:text-xs font-body font-semibold uppercase tracking-[0.12em] md:tracking-[0.15em] text-sand">
                      {column.title}
                    </h4>
                    {/* Decorative gold line motif */}
                    <div className="flex items-center gap-1.5 mt-2 max-w-[45px] md:max-w-[60px]">
                      <div className="h-[1px] bg-clay/40 flex-1" />
                      <span className="text-[5px] md:text-[7px] text-clay font-bold select-none">♦</span>
                      <div className="h-[1px] bg-clay/40 flex-1" />
                    </div>
                  </div>
                  <ul className="space-y-2 md:space-y-3">
                    {column.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          to={link.href}
                          className="text-[9px] min-[375px]:text-[10px] min-[410px]:text-[11px] md:text-sm text-sand/70 hover:text-cream hover:translate-x-0.5 transition-all duration-150 inline-block font-body"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

        </div>

        {/* Decorative Divider above Contact Details */}
        <div className="flex items-center gap-4 my-8 md:my-10 select-none">
          <div className="h-[1px] bg-white/10 flex-1" />
          <div className="flex items-center gap-2 text-clay/70">
            <span className="text-[8px]">♦</span>
            <span className="text-xs">✦</span>
            <span className="text-[8px]">♦</span>
          </div>
          <div className="h-[1px] bg-white/10 flex-1" />
        </div>

        {/* Contact Info Row - Aligned start on mobile, flex-row on desktop */}
        <div className="flex flex-col sm:flex-row items-start justify-start gap-4 sm:gap-6 py-1 pl-[6vw] md:pl-0">
          <div className="flex flex-col sm:flex-row w-full sm:w-auto items-start sm:items-start justify-start gap-4 sm:gap-[6vw]">
            <a
              href="tel:+919876543210"
              className="flex items-center gap-3 text-xs md:text-sm text-sand/80 hover:text-white transition-colors group justify-start"
            >
              <Phone className="w-3.5 h-3.5 md:w-4 md:h-4 text-clay shrink-0 group-hover:scale-110 transition-transform" />
              <span className="font-body">+91 98765 43210</span>
            </a>
            <a
              href="mailto:hello@shasjewellery.com"
              className="flex items-center gap-3 text-xs md:text-sm text-sand/80 hover:text-white transition-colors group justify-start"
            >
              <Mail className="w-3.5 h-3.5 md:w-4 md:h-4 text-clay shrink-0 group-hover:scale-110 transition-transform" />
              <span className="font-body">hello@shasjewellery.com</span>
            </a>
            <div className="flex items-center gap-3 text-xs md:text-sm text-sand/80 justify-start">
              <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 text-clay shrink-0" />
              <span className="font-body">Periyar Nagar, Erode, Tamil Nadu, India</span>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Copyright Bar - Spaced/Split exactly like the mobile/desktop mockups */}
      <div className="relative z-10 border-t border-white/5 bg-black/10">
        <div className="w-full px-[6vw] lg:px-[8vw] py-5 flex items-center justify-start text-[10px] md:text-xs text-sand/50 font-body">
          <p>© {currentYear} SHAS Jewellery. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
