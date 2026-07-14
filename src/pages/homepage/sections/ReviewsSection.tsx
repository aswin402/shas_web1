import { SectionHeading } from '@/components/ui/SectionHeading';
import { TestimonialCard } from '@/components/ui/TestimonialCard';
import { testimonials } from '@/data/testimonials';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export function ReviewsSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="section-spacing bg-warm-beige/40">
      <div className="max-w-[1400px] mx-auto section-padding">
        <SectionHeading
          eyebrow="Testimonials"
          title="Loved by Homes, Temples & Collectors"
          subtitle="Hear from customers who found their perfect piece."
        />
        <div
          ref={ref}
          className={`grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {testimonials.map((t, i) => (
            <div
              key={t.id}
              style={{ transitionDelay: `${i * 120}ms` }}
              className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            >
              <TestimonialCard testimonial={t} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
