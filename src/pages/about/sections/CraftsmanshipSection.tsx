import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { processSteps } from '@/data/aboutData';
import { LazyImage } from '@/components/ui/LazyImage';

export function CraftsmanshipSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="section-spacing bg-warm-beige/50">
      <div className="max-w-[1400px] mx-auto section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left — Image */}
          <div
            className={`relative transition-all duration-700 ${
              isVisible
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-8'
            }`}
          >
            <div className="relative overflow-hidden rounded-lg aspect-[4/5] bg-sand">
              <LazyImage
                src="/images/about/artisan-polishing.png"
                alt="Artisan carefully polishing a bronze statue with traditional tools"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            {/* Decorative accent */}
            <div className="absolute -bottom-3 -left-3 w-24 h-24 border-2 border-temple-red/30 rounded-lg -z-10" />
          </div>

          {/* Right — Content */}
          <div
            className={`transition-all duration-700 delay-200 ${
              isVisible
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 translate-x-8'
            }`}
          >
            <span className="inline-block text-xs font-body font-medium uppercase tracking-[0.2em] text-temple-red mb-4">
              Our Craft
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-[2.75rem] font-semibold text-deep-brown leading-tight mb-5">
              Crafted with Patience, Detail &amp; Respect
            </h2>
            <p className="text-base md:text-lg text-muted-brown leading-relaxed mb-8 max-w-lg">
              Each statue is shaped through a careful process of material
              selection, carving, finishing, polishing, inspection, and secure
              packing. Our focus is to preserve natural textures while giving
              every piece a refined finish.
            </p>

            {/* Process Steps */}
            <div className="space-y-0">
              {processSteps.map((step, index) => (
                <div key={step.number} className="relative flex items-start gap-4 pb-6 last:pb-0">
                  {/* Connecting line */}
                  {index < processSteps.length - 1 && (
                    <div className="absolute left-[15px] top-9 w-[2px] h-[calc(100%-20px)] bg-border" />
                  )}
                  {/* Number circle */}
                  <div className="relative z-10 w-8 h-8 shrink-0 rounded-full bg-temple-red flex items-center justify-center">
                    <span className="text-cream text-xs font-body font-bold">
                      {step.number}
                    </span>
                  </div>
                  {/* Title */}
                  <p className="text-sm sm:text-base font-body font-medium text-brown pt-1">
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
