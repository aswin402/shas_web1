import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { MapPin, ArrowRight } from 'lucide-react';

export function MapSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="bg-cream section-spacing">
      <div className="max-w-[1400px] mx-auto section-padding">
        <div className="text-center mb-10 md:mb-14">
          <span className="inline-block text-xs font-body font-medium uppercase tracking-[0.2em] text-clay mb-4 font-bold">
            Location
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-semibold text-deep-brown mb-3">
            Visit Our Showroom
          </h2>
          <p className="text-sm md:text-base text-muted-brown max-w-lg mx-auto font-body">
            Visit us to explore selected handcrafted ornaments or discuss your custom jewellery designs.
          </p>
        </div>

        <div
          className={`relative rounded-lg border border-border overflow-hidden transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {/* Map Placeholder */}
          <div className="bg-warm-beige/60 h-[300px] sm:h-[380px] md:h-[420px] flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-10 h-10 text-clay/40 mx-auto mb-3" />
              <p className="text-sm text-muted-brown font-body">Google Map Embed Here</p>
            </div>
          </div>

          {/* Overlay Card */}
          <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 bg-ivory/95 backdrop-blur-sm border border-border rounded-lg p-4 sm:p-5 shadow-lg max-w-xs">
            <div className="flex items-start gap-3 mb-3">
              <MapPin className="w-4 h-4 text-clay mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-body font-semibold text-brown">SHAS Jewellery Showroom</p>
                <p className="text-xs text-muted-brown">Erode, Tamil Nadu, India</p>
              </div>
            </div>
            <a
              href="https://maps.google.com/?q=Erode+Tamil+Nadu"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-body font-semibold text-clay uppercase tracking-[0.08em] hover:gap-2.5 transition-all duration-200"
            >
              Get Directions
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
