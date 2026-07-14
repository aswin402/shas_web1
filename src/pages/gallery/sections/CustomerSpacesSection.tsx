import type { CustomerSpace } from '@/types';
import { CustomerSpaceCard } from '../components/CustomerSpaceCard';

interface CustomerSpacesSectionProps {
  spaces: CustomerSpace[];
}

export function CustomerSpacesSection({ spaces }: CustomerSpacesSectionProps) {
  return (
    <section className="bg-ivory py-24 section-padding border-t border-border/30">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-16 reveal">
          <h2 className="text-3xl md:text-4xl font-heading text-deep-brown mb-4">
            Styled by Our Customers
          </h2>
          <p className="text-muted-brown max-w-2xl mx-auto font-body">
            Real people and brides featuring SHAS Jewellery creations.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {spaces.map((space, idx) => (
            <div key={space.id} style={{ transitionDelay: `${(idx % 6) * 100}ms` }}>
              <CustomerSpaceCard space={space} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
