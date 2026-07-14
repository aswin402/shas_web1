import { Star } from 'lucide-react';
import type { Testimonial } from '@/types';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="p-6 md:p-8 rounded-lg border border-border bg-ivory transition-all duration-300 hover:shadow-[0_4px_24px_oklch(0.78_0.045_75/0.2)]">
      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < testimonial.rating
                ? 'fill-terracotta text-terracotta'
                : 'text-border'
            }`}
          />
        ))}
      </div>

      {/* Review */}
      <blockquote className="text-sm md:text-base leading-relaxed text-brown mb-5 italic">
        &ldquo;{testimonial.review}&rdquo;
      </blockquote>

      {/* Author */}
      <div className="border-t border-border-light pt-4">
        <p className="text-sm font-body font-semibold text-deep-brown">
          {testimonial.name}
        </p>
        <p className="text-xs text-muted-brown mt-0.5">
          Purchased: {testimonial.product}
        </p>
      </div>
    </div>
  );
}
