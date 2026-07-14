import type { FeaturedSpace } from '@/types';

interface FeaturedLookbookGridProps {
  spaces: FeaturedSpace[];
}

export function FeaturedLookbookGrid({ spaces }: FeaturedLookbookGridProps) {
  // Assuming the spaces array has 4 items for this specific layout
  const largeSpace = spaces.find(s => s.size === 'large');
  const smallSpaces = spaces.filter(s => s.size === 'small').slice(0, 2);
  const wideSpace = spaces.find(s => s.size === 'wide');

  return (
    <section className="bg-ivory py-20 md:py-24 section-padding border-y border-border/30">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-16 reveal">
          <h2 className="text-3xl md:text-4xl font-heading text-deep-brown mb-4">Featured Styling</h2>
          <p className="text-muted-brown max-w-2xl mx-auto font-body">
            Traditional attire, bridal splendour, and minimal daily looks styled with handcrafted fine jewellery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[250px] md:auto-rows-[300px]">
          
          {/* Large Left Item */}
          {largeSpace && (
            <div className="md:col-span-7 row-span-2 relative group overflow-hidden rounded-2xl reveal">
              <img 
                src={largeSpace.image} 
                alt={largeSpace.caption}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep-brown/80 via-transparent to-transparent flex flex-col justify-end p-8">
                <span className="inline-block w-fit px-3 py-1 bg-clay text-white text-[10px] uppercase tracking-wider font-semibold rounded-full mb-3">
                  {largeSpace.tag}
                </span>
                <p className="text-cream font-heading text-2xl md:text-3xl">{largeSpace.caption}</p>
              </div>
            </div>
          )}

          {/* Small Right Items Stacked */}
          <div className="md:col-span-5 row-span-2 flex flex-col gap-6">
            {smallSpaces.map((space, idx) => (
              <div key={space.id} className={`relative h-full group overflow-hidden rounded-2xl reveal`} style={{ transitionDelay: `${(idx + 1) * 100}ms` }}>
                <img 
                  src={space.image} 
                  alt={space.caption}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-deep-brown/80 via-transparent to-transparent flex flex-col justify-end p-6">
                  <span className="inline-block w-fit px-3 py-1 bg-clay text-white text-[10px] uppercase tracking-wider font-semibold rounded-full mb-2">
                    {space.tag}
                  </span>
                  <p className="text-cream font-heading text-xl">{space.caption}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Wide Bottom Item */}
          {wideSpace && (
            <div className="md:col-span-12 row-span-1 relative group overflow-hidden rounded-2xl reveal" style={{ transitionDelay: '300ms' }}>
              <img 
                src={wideSpace.image} 
                alt={wideSpace.caption}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep-brown/80 via-transparent to-transparent flex flex-col justify-end p-8">
                <span className="inline-block w-fit px-3 py-1 bg-clay text-white text-[10px] uppercase tracking-wider font-semibold rounded-full mb-3">
                  {wideSpace.tag}
                </span>
                <p className="text-cream font-heading text-2xl md:text-3xl">{wideSpace.caption}</p>
              </div>
            </div>
          )}
          
        </div>
      </div>
    </section>
  );
}
