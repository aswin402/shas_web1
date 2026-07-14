import type { StylingGuide } from '@/types';
import { StylingGuideCard } from '../components/StylingGuideCard';

interface StylingGuideSectionProps {
  guides: StylingGuide[];
}

export function StylingGuideSection({ guides }: StylingGuideSectionProps) {
  return (
    <section className="bg-cream py-24 section-padding border-t border-border/30">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-16 reveal">
          <h2 className="text-3xl md:text-4xl font-heading text-deep-brown mb-4">
            Choose the Right Statue for Your Space
          </h2>
          <p className="text-muted-brown max-w-2xl mx-auto">
            Expert styling tips to bring warmth and character to every corner of your home.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {guides.map((guide, idx) => (
            <div key={guide.id} style={{ transitionDelay: `${idx * 100}ms` }}>
              <StylingGuideCard guide={guide} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
