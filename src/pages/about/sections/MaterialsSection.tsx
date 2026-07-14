import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { materials } from '@/data/aboutData';
import { LazyImage } from '@/components/ui/LazyImage';

export function MaterialsSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="section-spacing bg-cream">
      <div className="max-w-[1400px] mx-auto section-padding">
        {/* Header */}
        <div
          className={`text-center max-w-2xl mx-auto mb-12 sm:mb-16 md:mb-20 transition-all duration-700 ${
            isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="text-xs md:text-sm font-body uppercase tracking-[0.2em] text-temple-red font-semibold mb-3 block">
            The Canvas
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-semibold text-deep-brown tracking-wide mb-4">
            Materials We Carve
          </h2>
          <p className="text-sm md:text-base text-muted-brown leading-relaxed">
            Every material has its own texture, weight, and emotional presence.
          </p>
        </div>

        {/* Material Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.map((material, index) => (
            <div
              key={material.id}
              className={`group bg-ivory border border-border rounded-lg overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_8px_32px_oklch(0.28_0.06_45/0.08)] ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Image */}
              <div className="aspect-[16/10] overflow-hidden bg-sand">
                <LazyImage
                  src={material.image}
                  alt={`${material.name} texture`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              {/* Content */}
              <div className="p-5 sm:p-6">
                <h3 className="font-heading text-lg sm:text-xl font-semibold text-deep-brown mb-2 group-hover:text-temple-red transition-colors duration-300">
                  {material.name}
                </h3>
                <p className="text-sm text-muted-brown leading-relaxed">
                  {material.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
