import { MessageCircle } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export function CustomOrderSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="section-spacing bg-cream">
      <div className="max-w-[1400px] mx-auto section-padding">
        <div className={`bg-warm-beige/60 border border-border rounded-xl p-8 sm:p-10 md:p-14 lg:p-16 text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-block text-xs font-body font-medium uppercase tracking-[0.2em] text-clay mb-4 font-bold">
            Bespoke Creations
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-semibold text-deep-brown leading-tight mb-5">
            Looking for Bespoke Jewellery?
          </h2>
          <p className="text-base md:text-lg text-muted-brown leading-relaxed max-w-2xl mx-auto mb-8 font-body">
            Share your vision, preferred metal, gemstones, and design details. Our master artisans will collaborate with you to create a one-of-a-kind heirloom piece.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 bg-clay text-white text-sm font-body font-semibold uppercase tracking-[0.12em] rounded transition-all duration-300 hover:bg-burnt-gold active:scale-[0.97] shadow-sm">
              Start Custom Order
            </a>
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-7 py-3.5 border border-brown text-brown text-sm font-body font-semibold uppercase tracking-[0.12em] rounded transition-all duration-300 hover:bg-brown hover:text-cream active:scale-[0.97]">
              <MessageCircle className="w-4 h-4" />
              Talk on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
