import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { aboutTestimonials } from '@/data/aboutData';
import { Star } from 'lucide-react';

export function TestimonialSection() {
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
            Customer Love
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-[2.75rem] font-semibold text-deep-brown leading-tight">
            Trusted by Homes, Temples &amp; Collectors
          </h2>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {aboutTestimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`bg-ivory border border-border rounded-lg p-7 sm:p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_8px_32px_oklch(0.28_0.06_45/0.08)] ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Stars */}
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-temple-red text-temple-red"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-base text-brown leading-relaxed mb-6 italic">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="border-t border-border pt-4">
                <p className="text-sm font-body font-semibold text-deep-brown">
                  {testimonial.name}
                </p>
                <p className="text-xs text-muted-brown mt-0.5">
                  {testimonial.location}
                </p>
                <p className="text-xs text-temple-red mt-1">
                  {testimonial.product}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
