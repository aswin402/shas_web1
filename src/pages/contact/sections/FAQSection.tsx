import { useState } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { faqItems } from '@/data/contactData';
import { Plus, Minus } from 'lucide-react';

export function FAQSection() {
  const { ref, isVisible } = useScrollAnimation();
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section ref={ref} className="bg-cream section-spacing">
      <div className="max-w-[800px] mx-auto section-padding">
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block text-xs font-body font-medium uppercase tracking-[0.2em] text-temple-red mb-4">
            Help Center
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-semibold text-deep-brown">
            Common Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqItems.map((item, index) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className={`bg-ivory border border-border rounded-lg overflow-hidden transition-all duration-500 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                }`}
                style={{ transitionDelay: `${index * 60}ms` }}
              >
                <button
                  type="button"
                  onClick={() => toggle(item.id)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left hover:bg-warm-beige/30 transition-colors duration-200"
                >
                  <span className="text-sm md:text-base font-body font-medium text-brown leading-snug">
                    {item.question}
                  </span>
                  <span className="shrink-0 w-6 h-6 rounded-full bg-temple-red/10 flex items-center justify-center">
                    {isOpen ? (
                      <Minus className="w-3.5 h-3.5 text-temple-red" />
                    ) : (
                      <Plus className="w-3.5 h-3.5 text-temple-red" />
                    )}
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="px-5 pb-5 md:px-6 md:pb-6 text-sm text-muted-brown leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
