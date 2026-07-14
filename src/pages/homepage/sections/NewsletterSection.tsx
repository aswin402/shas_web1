import { useState } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export function NewsletterSection() {
  const { ref, isVisible } = useScrollAnimation();
  const [email, setEmail] = useState('');

  return (
    <section ref={ref} className="section-spacing bg-warm-beige/50">
      <div className="max-w-[1400px] mx-auto section-padding">
        <div className={`max-w-2xl mx-auto text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-block text-xs font-body font-medium uppercase tracking-[0.2em] text-clay mb-4 font-bold">
            Stay Updated
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-deep-brown leading-tight mb-4">
            Discover New Arrivals &amp; Heritage Ornaments
          </h2>
          <p className="text-base text-muted-brown leading-relaxed mb-8 font-body">
            Get updates on new handcrafted jewellery collections, exclusive releases, and bespoke styling advice.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="w-full flex-1 px-5 py-3.5 bg-ivory border border-border rounded text-sm font-body text-brown placeholder:text-muted-brown/60 focus:outline-none focus:border-clay/50 focus:ring-1 focus:ring-clay/20 transition-all"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-7 py-3.5 bg-clay text-white text-sm font-body font-semibold uppercase tracking-[0.12em] rounded transition-all duration-300 hover:bg-burnt-gold active:scale-[0.97] shrink-0 shadow-sm"
            >
              Subscribe
            </button>
          </form>
          <p className="text-xs text-muted-brown/70 mt-4">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
