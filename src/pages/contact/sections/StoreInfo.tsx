import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { storeDetails } from '@/data/contactData';

export function StoreInfo() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="bg-warm-beige/50 section-spacing">
      <div className="max-w-[1400px] mx-auto section-padding">
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block text-xs font-body font-medium uppercase tracking-[0.2em] text-temple-red mb-4">
            Visit & Connect
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-semibold text-deep-brown">
            Store Information
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 md:gap-6">
          {storeDetails.map((detail, index) => (
            <div
              key={detail.label}
              className={`bg-ivory border border-border rounded-lg p-5 md:p-6 text-center transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <span className="inline-block text-2xl mb-3">{detail.icon}</span>
              <h4 className="text-xs font-body font-semibold uppercase tracking-[0.12em] text-temple-red mb-2">
                {detail.label}
              </h4>
              <p className="text-sm text-brown leading-relaxed whitespace-pre-line">
                {detail.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
