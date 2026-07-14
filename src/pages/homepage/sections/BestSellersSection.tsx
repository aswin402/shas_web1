import { SectionHeading } from '@/components/ui/SectionHeading';
import { ShopProductCard } from '@/pages/shop/sections/ShopProductCard';
import { useProductsQuery } from '@/hooks/useProducts';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import type { ShopProduct } from '@/types';

export function BestSellersSection() {
  const { ref, isVisible } = useScrollAnimation();
  const { data: dbProducts = [], isLoading } = useProductsQuery();

  const mappedProducts: ShopProduct[] = (dbProducts || []).map((dbProduct: any) => ({
    id: dbProduct.id,
    name: dbProduct.name,
    category: dbProduct.category || '',
    material: dbProduct.details?.material || '',
    price: Number(dbProduct.price),
    originalPrice: dbProduct.price ? Math.round(Number(dbProduct.price) * 1.2) : undefined,
    image: dbProduct.image_url || '',
    badge: dbProduct.rating >= 4.8 ? 'Best Seller' : undefined,
    rating: Number(dbProduct.rating || 0),
    reviewCount: dbProduct.reviews_count || 0,
    usage: dbProduct.details?.usage || 'Living Room',
    size: dbProduct.details?.dimensions || '',
    colorFinish: dbProduct.details?.colorFinish || 'Natural',
    availability: (dbProduct.stock ?? 0) > 0 ? 'In Stock' : 'Made to Order',
    inStock: (dbProduct.stock ?? 0) > 0,
  }));

  // Show the first 4 in-stock products
  const featuredProducts = mappedProducts.filter(p => p.inStock).slice(0, 4);

  return (
    <section className="section-spacing bg-cream">
      <div className="max-w-[1400px] mx-auto section-padding">
        <SectionHeading
          eyebrow="OUR BEST SELLERS"
          title="Timeless Favourites"
          subtitle="Discover our most-loved, hand-finished heritage creations."
        />

        <div
          ref={ref}
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 transition-all duration-700 ${
            isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          {isLoading
            ? [1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-ivory border border-border/40 rounded-lg overflow-hidden flex flex-col h-[400px]">
                  <div className="aspect-[4/5] bg-muted-brown/5 animate-pulse w-full h-[300px]" />
                  <div className="p-4 space-y-3 flex-1 bg-ivory">
                    <div className="h-4 bg-muted-brown/10 rounded w-2/3 animate-pulse" />
                    <div className="h-3 bg-muted-brown/10 rounded w-1/3 animate-pulse" />
                    <div className="h-4 bg-muted-brown/10 rounded w-1/2 animate-pulse pt-2" />
                  </div>
                </div>
              ))
            : featuredProducts.map((product, index) => (
                <div
                  key={product.id}
                  style={{ transitionDelay: `${index * 80}ms` }}
                  className={`transition-all duration-500 ${
                    isVisible
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-6'
                  }`}
                >
                  <ShopProductCard product={product} />
                </div>
              ))
          }
        </div>
      </div>
    </section>
  );
}
