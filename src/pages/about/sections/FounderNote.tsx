import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export function FounderNote() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="section-spacing bg-warm-beige/50">
      <div className="max-w-[1400px] mx-auto section-padding">
        <div
          className={`max-w-3xl mx-auto text-center transition-all duration-700 ${
            isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-6'
          }`}
        >
          {/* Large decorative quote mark */}
          <span className="inline-block text-7xl sm:text-8xl font-heading text-clay/25 leading-none select-none mb-2">
            &ldquo;
          </span>

          <h2 className="font-heading text-2xl sm:text-3xl md:text-[2rem] font-semibold text-deep-brown leading-tight mb-6">
            A Note from Deepa Sakthi
          </h2>

          <p className="font-heading text-lg sm:text-xl md:text-2xl text-brown italic leading-relaxed mb-6 font-semibold">
            &ldquo;Getting ready is never just about what you wear, it’s about how you feel.&rdquo;
          </p>

          <p className="text-base text-muted-brown leading-relaxed mb-8 max-w-2xl mx-auto font-body">
            Every entrepreneur’s journey looks different. Success is visible; the struggle behind it rarely is. Building SHAS took courage, consistency, and an unwavering belief in preserving traditional Tamil Nadu artistry. One step at a time, we stay committed to crafting masterpieces that carry stories, celebrations, and moments you’ll cherish forever.
          </p>

          {/* Signature */}
          <div className="inline-flex items-center gap-3">
            <div className="w-10 h-[1px] bg-clay/40" />
            <span className="text-sm font-body font-bold uppercase tracking-[0.12em] text-muted-brown">
              Deepa Sakthi — Founder, SHAS
            </span>
            <div className="w-10 h-[1px] bg-clay/40" />
          </div>
        </div>
      </div>
    </section>
  );
}
