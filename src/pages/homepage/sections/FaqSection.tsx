import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const faqs = [
  {
    q: 'What materials do you use for your jewellery?',
    a: 'We craft fine jewellery using 100% certified 22k Gold, 18k Rose Gold, and 92.5 Sterling Silver, hand-set with genuine rubies, emeralds, and Polki diamonds.',
  },
  {
    q: 'Are all your products hallmarked?',
    a: 'Yes, all SHAS gold jewellery carries the official BIS Hallmark, ensuring the highest standards of metal purity. Gemstones also come with certificates of authenticity.',
  },
  {
    q: 'Do you deliver across India?',
    a: 'Absolutely. We ship fully-insured orders in secure vault packaging across India. All shipments are fully covered, so you can shop with peace of mind.',
  },
  {
    q: 'Do you make custom bridal jewellery?',
    a: 'Yes, we specialize in bespoke custom creations. You can share your design sketches or references, and our master goldsmiths in Erode will bring them to life.',
  },
];

export function FaqSection() {
  const { ref, isVisible } = useScrollAnimation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section ref={ref} className="section-spacing bg-cream border-t border-border/20">
      <div className="max-w-[800px] mx-auto section-padding">
        <SectionHeading
          eyebrow="FAQ"
          title="Frequently Asked Questions"
          subtitle="All you need to know about our handcrafted heritage collections"
        />

        <div
          className={`space-y-4 transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="border border-border/40 rounded-lg overflow-hidden bg-ivory/60 transition-all duration-300"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-4.5 text-left cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="font-heading text-base font-semibold text-deep-brown">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-brown shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-clay' : ''
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 pb-5 pt-2 text-sm md:text-base font-body text-muted-brown leading-relaxed border-t border-border/20 animate-fadeIn">
                      {faq.a}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
