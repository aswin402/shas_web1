import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { values } from '@/data/aboutData';

export function ValuesSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="section-spacing bg-cream">
      <div className="max-w-[1400px] mx-auto section-padding">
        {/* Header */}
        <div
          className={`text-center max-w-2xl mx-auto mb-12 md:mb-16 transition-all duration-700 ${
            isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-6'
          }`}
        >
          <span className="inline-block text-xs font-body font-medium uppercase tracking-[0.2em] text-temple-red mb-4">
            Our Values
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-[2.75rem] font-semibold text-deep-brown leading-tight">
            What We Believe In
          </h2>
        </div>

        {/* Value Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <div
              key={value.title}
              className={`bg-ivory border border-border rounded-lg p-7 sm:p-8 text-center transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_8px_32px_oklch(0.28_0.06_45/0.08)] ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: `${index * 120}ms` }}
            >
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-temple-red/10 text-temple-red text-xl mb-5">
                {value.icon}
              </span>
              <h3 className="font-heading text-lg sm:text-xl font-semibold text-deep-brown mb-3">
                {value.title}
              </h3>
              <p className="text-sm text-muted-brown leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
