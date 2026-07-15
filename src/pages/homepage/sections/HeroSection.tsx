import { useRef, useEffect } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { ArrowRight, Heart, Leaf, ShieldCheck, Truck } from 'lucide-react';
import heroBg from '@/assets/shas_homepage_desktop.png';
import heroBgMob from '@/assets/shas_homepage_mob.png';

export function HeroSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;

    const interval = setInterval(() => {
      if (window.innerWidth >= 1024) return;

      const width = container.offsetWidth;
      const currentScroll = container.scrollLeft;
      const maxScroll = container.scrollWidth - width;

      if (currentScroll >= maxScroll - 10) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: width, behavior: 'smooth' });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={ref}
      className="relative bg-cream flex flex-col items-stretch overflow-hidden"
    >
      {/* Hero Main Area */}
      <div className="relative min-h-[calc(100dvh-196px)] md:min-h-[calc(100dvh-170px)] flex items-start md:items-center justify-start overflow-hidden">
        {/* Background Image Container */}
        <div className="absolute inset-0 w-full h-full select-none pointer-events-none z-0">
          <picture>
            <source srcSet={heroBg} media="(min-width: 768px)" />
            <img
              src={heroBgMob}
              alt="SHAS Jewellery Background"
              className="w-full h-full object-cover object-top md:object-right"
            />
          </picture>
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-[1400px] mx-auto w-full px-6 md:px-10 lg:px-16 xl:px-20 pt-12 pb-24 md:pt-28 md:pb-24">
          <div
            className={`max-w-xl transition-all duration-700 delay-200 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`}
          >
            {/* Heading */}
            <h1 className="font-heading text-[28px] sm:text-4xl md:text-5xl lg:text-[3.5rem] xl:text-[4rem] font-bold text-primary leading-[1.15] mb-4">
              Crafted to<br />
              Celebrate Every<br />
              Moment
            </h1>

            {/* Description */}
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-[#2A2020] leading-relaxed mb-8 max-w-lg font-body font-medium">
              Timeless jewellery inspired by tradition,<br className="hidden sm:inline" />
              crafted for today's women.
            </p>

            {/* CTAs */}
            <div className="flex">
              <a
                href="/shop"
                className="inline-flex items-center justify-center gap-2 px-3.5 py-2 md:px-5 md:py-3 bg-clay text-white text-xs font-body font-bold uppercase tracking-[0.2em] rounded transition-all duration-300 hover:bg-burnt-gold active:scale-[0.98] shadow-sm"
              >
                Shop Collection
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Strip */}
      <div className="bg-primary py-8 sm:py-10 md:py-12 px-6 md:px-10 lg:px-16 border-t border-white/10 w-full z-10">
        <div 
          ref={carouselRef}
          className="max-w-[1400px] mx-auto flex lg:grid lg:grid-cols-4 gap-x-6 lg:gap-8 overflow-x-auto lg:overflow-x-visible snap-x snap-mandatory scroll-smooth scrollbar-none"
        >
          {/* Handcrafted */}
          <div className="w-full shrink-0 snap-center lg:w-auto lg:shrink-0 flex items-center justify-center lg:justify-start gap-4 sm:gap-5 pr-2 lg:border-r lg:border-white/10">
            <Heart className="w-8 h-8 text-clay shrink-0" />
            <div>
              <p className="text-sm sm:text-base font-heading font-bold uppercase tracking-wider text-cream leading-tight">
                Handcrafted
              </p>
              <p className="text-[11px] sm:text-xs md:text-sm font-body text-white/60 mt-1 leading-tight">
                With love by skilled artisans
              </p>
            </div>
          </div>

          {/* Hallmarked */}
          <div className="w-full shrink-0 snap-center lg:w-auto lg:shrink-0 flex items-center justify-center lg:justify-start gap-4 sm:gap-5 pr-2 lg:border-r lg:border-white/10">
            <ShieldCheck className="w-8 h-8 text-clay shrink-0" />
            <div>
              <p className="text-sm sm:text-base font-heading font-bold uppercase tracking-wider text-cream leading-tight">
                Hallmarked
              </p>
              <p className="text-[11px] sm:text-xs md:text-sm font-body text-white/60 mt-1 leading-tight">
                Certified quality and authenticity
              </p>
            </div>
          </div>

          {/* Free Delivery */}
          <div className="w-full shrink-0 snap-center lg:w-auto lg:shrink-0 flex items-center justify-center lg:justify-start gap-4 sm:gap-5 pr-2 lg:border-r lg:border-white/10">
            <Truck className="w-8 h-8 text-clay shrink-0" />
            <div>
              <p className="text-sm sm:text-base font-heading font-bold uppercase tracking-wider text-cream leading-tight">
                Free Delivery
              </p>
              <p className="text-[11px] sm:text-xs md:text-sm font-body text-white/60 mt-1 leading-tight">
                Insured and express delivery worldwide
              </p>
            </div>
          </div>

          {/* Sustainable */}
          <div className="w-full shrink-0 snap-center lg:w-auto lg:shrink-0 flex items-center justify-center lg:justify-start gap-4 sm:gap-5 pr-2">
            <Leaf className="w-8 h-8 text-clay shrink-0" />
            <div>
              <p className="text-sm sm:text-base font-heading font-bold uppercase tracking-wider text-cream leading-tight">
                Sustainable
              </p>
              <p className="text-[11px] sm:text-xs md:text-sm font-body text-white/60 mt-1 leading-tight">
                Ethically sourced and eco-friendly
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
