import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { qualityPoints } from '@/data/aboutData';
import { CheckCircle } from 'lucide-react';
import { LazyImage } from '@/components/ui/LazyImage';

export function QualityPackaging() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="section-spacing bg-warm-beige/40">
      <div className="max-w-[1400px] mx-auto section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left — Content */}
          <div
            className={`space-y-6 md:space-y-8 transition-all duration-700 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="space-y-3">
              <span className="text-xs md:text-sm font-body uppercase tracking-[0.2em] text-temple-red font-semibold">
                Care & Delivery
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-semibold text-deep-brown tracking-wide leading-tight">
                Quality Checks & Packaging
              </h2>
            </div>
            <p className="text-sm md:text-base text-muted-brown leading-relaxed max-w-xl">
              Every sculpture undergoes strict quality checks before dispatch.
              Our packaging is designed to protect custom pieces over long transit times.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
              {qualityPoints.map((point) => (
                <div key={point.title} className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-temple-red shrink-0" />
                  <span className="text-sm text-brown font-body">{point.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Image */}
          <div
            className={`relative transition-all duration-700 delay-200 ${
              isVisible
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 translate-x-8'
            }`}
          >
            <div className="relative overflow-hidden rounded-lg aspect-[4/5] bg-sand">
              <LazyImage
                src="/images/about/packaging-care.png"
                alt="Handcrafted marble statue carefully packed in multi-layer protective packaging"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-3 -right-3 w-24 h-24 border-2 border-temple-red/30 rounded-lg -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
