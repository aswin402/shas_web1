import { ArrowRight } from 'lucide-react';
import { craftsmanshipStats } from '@/data/navigation';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { LazyImage } from '@/components/ui/LazyImage';

export function CraftsmanshipSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="section-spacing bg-warm-beige/50">
      <div className="max-w-[1400px] mx-auto section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left — Content */}
          <div
            className={`space-y-6 md:space-y-8 transition-all duration-700 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="space-y-3">
              <span className="text-xs md:text-sm font-body uppercase tracking-[0.2em] text-clay font-bold">
                Heritage Artistry
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-semibold text-deep-brown tracking-wide leading-tight">
                Where Heritage Artistry Meets Pure Gold
              </h2>
            </div>
            <p className="text-sm md:text-base text-muted-brown leading-relaxed max-w-xl font-body">
              Our master goldsmiths bring generations of design wisdom to every handcrafted ornament. Each gold, silver, and gemstone piece is finished with absolute precision and devotion — embodying timeless elegance, hallmark purity, and the authentic craftsmanship Erode's families have trusted for generations.
            </p>

            {/* Stats list */}
            <div className="grid grid-cols-3 gap-6 max-w-lg">
              {craftsmanshipStats.map((stat) => (
                <div key={stat.label} className="space-y-1">
                  <p className="text-2xl md:text-3xl font-heading font-semibold text-clay">
                    {stat.value}
                  </p>
                  <p className="text-[10px] md:text-xs font-body text-muted-brown uppercase tracking-wider">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <a
              href="/about"
              className="group inline-flex items-center gap-2 px-6 py-3 border border-brown text-brown text-xs font-body font-semibold uppercase tracking-[0.12em] rounded transition-all duration-300 hover:bg-brown hover:text-cream active:scale-[0.98]"
            >
              Our Story
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          {/* Right — Image */}
          <div
            className={`relative transition-all duration-700 delay-200 ${
              isVisible
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 translate-x-8'
            }`}
          >
            <div className="relative overflow-hidden rounded-lg aspect-[4/3] bg-sand">
              <LazyImage
                src="/images/craftsmanship.webp"
                alt="Artisan carefully finishing a gold necklace in a traditional workshop"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            {/* Decorative accent */}
            <div className="absolute -bottom-3 -right-3 w-24 h-24 border-2 border-clay/30 rounded-lg -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
