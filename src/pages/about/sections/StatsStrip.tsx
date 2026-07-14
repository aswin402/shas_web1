import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { aboutStats } from '@/data/aboutData';

export function StatsStrip() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="bg-dark-luxury py-14 md:py-20">
      <div className="max-w-[1400px] mx-auto section-padding">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
          {aboutStats.map((stat, index) => (
            <div
              key={stat.label}
              className={`text-center transition-all duration-700 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Accent line */}
              <div className="w-8 h-[2px] bg-temple-red mx-auto mb-5" />
              <div className="text-3xl sm:text-4xl md:text-[2.75rem] font-heading font-semibold text-cream mb-2">
                {stat.value}
              </div>
              <div className="text-xs font-body font-medium uppercase tracking-[0.12em] text-sand/70">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
