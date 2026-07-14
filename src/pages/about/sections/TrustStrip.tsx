import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { trustStripItems } from '@/data/aboutData';

export function TrustStrip() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section
      ref={ref}
      className="bg-warm-beige border-y border-border"
    >
      <div className="max-w-[1400px] mx-auto section-padding py-8 md:py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {trustStripItems.map((item, index) => (
            <div
              key={item.label}
              className={`flex items-center justify-center gap-3 transition-all duration-500 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-3'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <span className="text-xl sm:text-2xl shrink-0">{item.icon}</span>
              <span className="text-xs sm:text-sm font-body font-medium uppercase tracking-[0.08em] text-brown">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
