import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { contactOptions } from '@/data/contactData';
import { ArrowUpRight } from 'lucide-react';

export function ContactOptions() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="bg-cream section-spacing">
      <div className="max-w-[1400px] mx-auto section-padding">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block text-xs font-body font-medium uppercase tracking-[0.2em] text-temple-red mb-4">
            Reach Out
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-semibold text-deep-brown">
            Choose How You'd Like to Connect
          </h2>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {contactOptions.map((option, index) => (
            <div
              key={option.id}
              className={`group bg-ivory border border-border rounded-lg p-6 md:p-7 transition-all duration-500 hover:shadow-[0_8px_32px_oklch(0.28_0.06_45/0.08)] hover:-translate-y-1 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Icon */}
              <span className="inline-block text-2xl mb-4">{option.icon}</span>

              {/* Title */}
              <h3 className="font-heading text-lg font-semibold text-deep-brown mb-2">
                {option.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-muted-brown leading-relaxed mb-4">
                {option.description}
              </p>

              {/* Info */}
              <p className="text-sm font-body font-medium text-brown mb-5">
                {option.info}
              </p>

              {/* CTA */}
              <a
                href={option.href}
                target={option.href.startsWith('http') ? '_blank' : undefined}
                rel={option.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="inline-flex items-center gap-1.5 text-sm font-body font-semibold text-temple-red uppercase tracking-[0.08em] transition-all duration-200 group-hover:gap-2.5"
              >
                {option.cta}
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
