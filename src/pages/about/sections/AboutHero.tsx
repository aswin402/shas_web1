import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LazyImage } from '@/components/ui/LazyImage';

export function AboutHero() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section
      ref={ref}
      className="bg-cream pt-12 md:pt-16 lg:pt-20 border-b border-border/20"
    >
      <div className="max-w-[1400px] mx-auto section-padding grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left — Content */}
        <div
          className={`space-y-6 md:space-y-8 transition-all duration-700 ${
            isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="space-y-3">
            <span className="text-xs md:text-sm font-body uppercase tracking-[0.15em] text-clay font-bold">
              Our Journey
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-semibold text-deep-brown tracking-wide leading-[1.1]">
              Preserving Erode's Heritage of Fine Jewellery
            </h1>
          </div>
          <p className="text-sm md:text-base font-body text-brown leading-relaxed max-w-xl">
            SHAS Jewellery was born out of a profound passion for preserving South India's rich heritage of temple and bridal jewellery. We bridge the gap between skilled traditional goldsmiths and discerning patrons worldwide, showcasing exquisite 22k gold, sterling silver, and bespoke heirloom masterpieces.
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-clay text-white text-sm font-body font-semibold uppercase tracking-[0.12em] rounded transition-all duration-300 hover:bg-burnt-gold hover:shadow-lg active:scale-[0.97] shadow-sm"
            >
              Explore Collection
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 border border-brown text-brown text-sm font-body font-semibold uppercase tracking-[0.12em] rounded transition-all duration-300 hover:bg-brown hover:text-cream active:scale-[0.97]"
            >
              Custom Orders
            </Link>
          </div>
        </div>

        {/* Right — Image */}
        <div className="order-1 lg:order-2 relative h-[50vh] sm:h-[55vh] lg:h-auto overflow-hidden bg-warm-beige">
          <LazyImage
            src="/images/about/hero-artisan.png"
            alt="Skilled goldsmith carefully setting gemstones on a bridal choker in Erode workshop"
            className="w-full h-full object-cover object-center"
          />

          {/* Floating Stat Card */}
          <div
            className={`absolute bottom-6 left-6 sm:bottom-10 sm:left-10 bg-cream/95 backdrop-blur-sm border border-border rounded-lg p-4 shadow-[0_8px_32px_oklch(0.28_0.06_45/0.12)] z-10 max-w-[210px] transition-all duration-700 delay-500 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
            }`}
          >
            <p className="text-2xl font-heading font-semibold text-clay mb-0.5">
              5000+
            </p>
            <p className="text-xs font-body text-muted-brown">
              handcrafted ornaments delivered
            </p>
          </div>

          {/* Artisan Badge */}
          <div
            className={`absolute top-6 right-6 sm:top-10 sm:right-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-clay flex items-center justify-center z-10 transition-all duration-700 delay-700 ${
              isVisible
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-75'
            }`}
          >
            <span className="text-white text-[9px] sm:text-[10px] font-body font-bold uppercase tracking-[0.08em] text-center leading-tight">
              Artisan
              <br />
              Made
            </span>
          </div>

          {/* Small overlapping card */}
          <div
            className={`hidden md:block absolute top-6 left-6 sm:top-10 sm:left-10 bg-ivory/95 backdrop-blur-sm border border-border rounded-lg overflow-hidden shadow-lg w-28 h-36 z-10 transition-all duration-700 delay-600 ${
              isVisible
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-4'
            }`}
          >
            <LazyImage
              src="/images/about/workshop-display.png"
              alt="Luxury jewelry showroom with necklaces displayed"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
