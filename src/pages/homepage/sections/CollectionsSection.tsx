import { useMemo } from 'react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { CollectionCard } from '@/components/ui/CollectionCard';
import { collections as staticCollections } from '@/data/collections';
import { useProductsQuery } from '@/hooks/useProducts';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export function CollectionsSection() {
  const { ref, isVisible } = useScrollAnimation();
  const { data: dbProducts = [], isLoading } = useProductsQuery();

  // Dynamically extract categories from live database products
  const collections = useMemo(() => {
    if (isLoading || !dbProducts || dbProducts.length === 0) {
      return staticCollections;
    }

    const categories = Array.from(
      new Set(dbProducts.map((p: any) => p.category).filter(Boolean))
    );

    if (categories.length === 0) {
      return staticCollections;
    }

    return categories.map((cat: any) => {
      const firstProd = dbProducts.find((p: any) => p.category === cat);
      // Format category title nicely
      const title = cat.toLowerCase().includes('collection') || cat.toLowerCase().includes('jewellery') || cat.toLowerCase().includes('ornaments') || cat.toLowerCase().includes('earrings') || cat.toLowerCase().includes('bangles')
        ? cat
        : `${cat} Collection`;

      return {
        id: cat.toLowerCase().replace(/\s+/g, '-'),
        title: title,
        description: `Exquisite hand-finished ${cat.toLowerCase()} jewellery crafted to reflect heritage and elegance.`,
        image: firstProd?.image_url || '/images/collections/placeholder.webp',
        slug: cat.toLowerCase().replace(/\s+/g, '-'),
      };
    });
  }, [dbProducts, isLoading]);

  return (
    <section className="section-spacing bg-warm-beige/40">
      <div className="max-w-[1400px] mx-auto section-padding">
        <SectionHeading
          eyebrow="Curated Categories"
          title="Explore Our Collections"
          subtitle="Choose jewellery by collection, metal type, or celebration."
        />

        <div
          ref={ref}
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 transition-all duration-700 ${
            isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          {isLoading
            ? [1, 2, 3].map((i) => (
                <div key={i} className="aspect-[4/3] bg-muted-brown/10 animate-pulse rounded-lg" style={{ minHeight: '260px' }} />
              ))
            : collections.map((collection, index) => (
                <div
                  key={collection.id}
                  style={{ transitionDelay: `${index * 100}ms` }}
                  className={`transition-all duration-500 ${
                    isVisible
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-6'
                  }`}
                >
                  <CollectionCard collection={collection} />
                </div>
              ))
          }
        </div>
      </div>
    </section>
  );
}
