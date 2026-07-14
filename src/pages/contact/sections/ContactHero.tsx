import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { ArrowRight, MessageCircle } from 'lucide-react';

export function ContactHero() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section
      ref={ref}
      className="relative min-h-[calc(100dvh-4rem)] md:min-h-[calc(100dvh-72px)] bg-cream"
    >
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100dvh-4rem)] md:min-h-[calc(100dvh-72px)]">
        {/* Left — Content */}
        <div className="order-2 lg:order-1 flex flex-col justify-center px-6 py-12 sm:px-10 md:px-14 lg:px-16 xl:px-20 bg-warm-beige/40">
          <div
            className={`max-w-lg transition-all duration-700 delay-200 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-6'
            }`}
          >
            {/* Eyebrow */}
            <span className="inline-block text-xs font-body font-medium uppercase tracking-[0.2em] text-clay mb-5 font-bold">
              Get in Touch
            </span>

            {/* Heading */}
            <h1 className="font-heading text-3xl sm:text-4xl md:text-[3rem] lg:text-[3.25rem] xl:text-[3.5rem] font-semibold text-deep-brown leading-[1.1] mb-6">
              We're Here to Help You Find the Right Jewellery
            </h1>

            {/* Description */}
            <p className="text-base md:text-lg text-muted-brown leading-relaxed mb-8 max-w-md font-body">
              Have a question about an ornament, custom design, purity, delivery, or bridal purchase? Reach out to SHAS Jewellery and our team will guide you with care.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#contact-form"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-clay text-white text-sm font-body font-semibold uppercase tracking-[0.12em] rounded transition-all duration-300 hover:bg-burnt-gold active:scale-[0.97] shadow-sm"
              >
                Send a Message
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 border border-brown text-brown text-sm font-body font-semibold uppercase tracking-[0.12em] rounded transition-all duration-300 hover:bg-brown hover:text-cream active:scale-[0.97]"
              >
                <MessageCircle className="w-4 h-4" />
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Right — Image */}
        <div className="order-1 lg:order-2 relative h-[50vh] sm:h-[55vh] lg:h-auto overflow-hidden bg-warm-beige">
          <img
            src="/images/contact/contact-hero.png"
            alt="Handcrafted gold jewellery collections in a warm, elegant Erode showroom with natural light"
            className="w-full h-full object-cover object-center"
          />

          {/* Customer Support Badge */}
          <div
            className={`absolute top-6 right-6 sm:top-10 sm:right-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-clay flex items-center justify-center transition-all duration-700 delay-700 ${
              isVisible
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-75'
            }`}
          >
            <span className="text-white text-[8px] sm:text-[10px] font-body font-bold uppercase tracking-[0.08em] text-center leading-tight">
              Customer
              <br />
              Support
            </span>
          </div>

          {/* Floating Card */}
          <div
            className={`absolute bottom-6 left-6 sm:bottom-10 sm:left-10 bg-cream/95 backdrop-blur-sm border border-border rounded-lg p-4 shadow-[0_8px_32px_oklch(0.28_0.06_45/0.12)] max-w-[220px] transition-all duration-700 delay-500 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
            }`}
          >
            <p className="text-xs font-body font-semibold text-clay uppercase tracking-[0.1em] mb-1">
              ✦ Available
            </p>
            <p className="text-sm font-body text-brown leading-snug">
              Custom design guidance available
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
