import { ArrowRight } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { LazyImage } from '@/components/ui/LazyImage';

export function PremiumBanner() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-dark-luxury"
    >
      {/* Background gradient & texture */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-luxury via-dark-luxury-light to-deep-red/20" />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23CBB69D' fill-rule='evenodd'%3E%3Cpath d='M20 20.5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-[1400px] mx-auto section-padding py-16 sm:py-20 md:py-24 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Content */}
          <div
            className={`transition-all duration-700 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-6'
            }`}
          >
            {/* Decorative line */}
            <div className="w-12 h-0.5 bg-clay mb-6" />

            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-semibold text-cream leading-tight mb-5">
              The Heritage Gold &amp;<br />
              Bridal Masterpieces
            </h2>
            <p className="text-base md:text-lg text-sand/80 leading-relaxed mb-8 max-w-lg font-body">
              Good things take time, but the best things? They take a little extra care 💎 We don’t believe in rushed timelines or false promises. Every piece at SHAS is handcrafted by artisans who take the time they need to ensure absolute perfection. Because when it comes to your special moments, you deserve nothing less than a masterpiece.
            </p>

            <a
              href="/shop"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-clay text-white text-sm font-body font-semibold uppercase tracking-[0.12em] rounded transition-all duration-300 hover:bg-burnt-gold active:scale-[0.97] shadow-sm"
            >
              View Heritage Collection
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Image Side */}
          <div
            className={`hidden lg:block transition-all duration-700 delay-200 ${
              isVisible
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 translate-x-8'
            }`}
          >
            <div className="relative overflow-hidden rounded-lg aspect-[3/2]">
              <LazyImage
                src="/images/premium-collection.webp"
                alt="Premium bridal and temple jewelry collection"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-dark-luxury/40 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
