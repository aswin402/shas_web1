import { ArrowRight } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export function PromoBanner() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`col-span-full my-2 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-deep-brown via-dark-luxury to-deep-brown">
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, oklch(0.42 0.14 28 / 0.3) 0%, transparent 50%),
                               radial-gradient(circle at 80% 50%, oklch(0.60 0.075 65 / 0.2) 0%, transparent 50%)`,
            }}
          />
        </div>

        <div className="relative px-6 py-8 md:px-10 md:py-10 lg:px-14 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left max-w-xl">
            <span className="inline-block text-[10px] font-body font-medium uppercase tracking-[0.2em] text-clay mb-2">
              Bespoke Creations
            </span>
            <h3 className="font-heading text-2xl md:text-3xl font-semibold text-cream mb-3">
              Custom Jewellery Crafted for You
            </h3>
            <p className="text-sm text-sand/80 leading-relaxed font-body">
              Share your design reference, preferred metal, gemstone, and budget. We'll help create a meaningful handcrafted piece tailored to your vision.
            </p>
          </div>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 text-[11px] font-body font-semibold uppercase tracking-[0.12em] bg-clay text-white rounded hover:bg-burnt-gold transition-colors group shrink-0 shadow-sm"
          >
            Start Custom Order
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </div>
  );
}
