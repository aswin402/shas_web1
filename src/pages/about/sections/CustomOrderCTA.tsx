import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { customSteps } from '@/data/aboutData';
import { ArrowRight, MessageCircle } from 'lucide-react';

export function CustomOrderCTA() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="section-spacing bg-cream">
      <div className="max-w-[1400px] mx-auto section-padding">
        <div
          className={`bg-warm-beige rounded-xl p-8 sm:p-10 md:p-14 lg:p-16 transition-all duration-700 ${
            isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left — Content */}
            <div>
              <span className="inline-block text-xs font-body font-medium uppercase tracking-[0.2em] text-clay mb-4 font-bold">
                Custom Orders
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-[2.5rem] font-semibold text-deep-brown leading-tight mb-5">
                Custom Jewellery Crafted for You
              </h2>
              <p className="text-base md:text-lg text-muted-brown leading-relaxed mb-8 max-w-lg font-body">
                Whether it is a bridal set, traditional temple jhumkas, a minimal gift, or a custom family heirloom, we help design and craft bespoke jewellery based on your design sketch, metal choice, weight, and gemstone preferences.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-clay text-white text-sm font-body font-semibold uppercase tracking-[0.12em] rounded transition-all duration-300 hover:bg-burnt-gold active:scale-[0.97] shadow-sm"
                >
                  Start Custom Order
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-7 py-3.5 border border-brown text-brown text-sm font-body font-semibold uppercase tracking-[0.12em] rounded transition-all duration-300 hover:bg-brown hover:text-cream active:scale-[0.97]"
                >
                  <MessageCircle className="w-4 h-4" />
                  Talk on WhatsApp
                </a>
              </div>
            </div>

            {/* Right — Steps */}
            <div className="grid grid-cols-2 gap-4 sm:gap-5">
              {customSteps.map((step, index) => (
                <div
                  key={step.number}
                  className={`bg-cream/80 border border-border rounded-lg p-5 sm:p-6 text-center transition-all duration-500 ${
                    isVisible
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: `${300 + index * 100}ms` }}
                >
                  <span className="block text-2xl sm:text-3xl font-heading font-semibold text-clay mb-2">
                    {step.number}
                  </span>
                  <p className="text-xs sm:text-sm font-body font-medium text-brown uppercase tracking-[0.08em]">
                    {step.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
