import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { missionCards } from '@/data/aboutData';

export function MissionVisionCards() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="section-spacing bg-warm-beige/40">
      <div className="max-w-[1400px] mx-auto section-padding">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {missionCards.map((card, index) => (
            <div
              key={card.title}
              className={`bg-ivory border border-border rounded-lg p-8 sm:p-10 text-center transition-all duration-700 hover:-translate-y-1 hover:shadow-[0_8px_32px_oklch(0.28_0.06_45/0.08)] ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <span className="inline-block text-3xl mb-4">{card.icon}</span>
              <h3 className="font-heading text-xl sm:text-2xl font-semibold text-deep-brown mb-3">
                {card.title}
              </h3>
              <p className="text-sm sm:text-base text-muted-brown leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
