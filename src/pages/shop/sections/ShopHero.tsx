import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { heroBadges } from '@/data/shopData';
import { Gem, ShieldCheck, Palette, Package } from 'lucide-react';

const badgeIcons = [Gem, ShieldCheck, Palette, Package];

export function ShopHero() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="bg-warm-beige/60 overflow-hidden">
      <div
        ref={ref}
        className={`max-w-[1400px] mx-auto section-padding py-10 md:py-16 lg:py-20 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text Content */}
          <div>
            <span className="inline-block text-xs font-body font-medium uppercase tracking-[0.2em] text-clay mb-3 font-bold">
              Handcrafted Collection
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-[2.75rem] lg:text-5xl font-semibold text-deep-brown leading-tight mb-4 md:mb-6">
              Shop Heritage &amp; Bridal Jewellery
            </h1>
            <p className="text-base md:text-lg text-muted-brown leading-relaxed max-w-lg mb-8 font-body">
              Explore handcrafted ornaments made with timeless materials, warm details, and master artistry for weddings, celebrations, and everyday styling.
            </p>

            {/* Info Badges */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {heroBadges.map((badge, i) => {
                const Icon = badgeIcons[i];
                return (
                  <div
                    key={badge}
                    className="flex items-center gap-2.5 px-3 py-2.5 bg-cream/70 border border-border-light rounded-lg"
                  >
                    <Icon className="w-4 h-4 text-clay shrink-0" />
                    <span className="text-xs font-body font-medium text-brown">
                      {badge}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative hidden lg:block">
            <div className="rounded-xl overflow-hidden border border-border/40">
              <img
                src="/images/shop-hero.webp"
                alt="Curated collection of handcrafted gold and silver jewellery in a warm boutique showroom"
                className="w-full h-[380px] object-cover"
              />
            </div>
            {/* Decorative accent */}
            <div className="absolute -bottom-3 -right-3 w-24 h-24 rounded-full border-2 border-clay/15 -z-10" />
            <div className="absolute -top-3 -left-3 w-16 h-16 rounded-full border-2 border-clay/20 -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
