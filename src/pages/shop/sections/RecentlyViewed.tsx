import { useState } from 'react';
import { ShoppingBag, Heart, Star } from 'lucide-react';
import { shopProducts } from '@/data/shopData';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

export function RecentlyViewed() {
  const { ref, isVisible } = useScrollAnimation();
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
  // Show last 4 products as "recommended"
  const recommended = shopProducts.slice(0, 4);

  return (
    <section className="section-spacing bg-cream">
      <div className="max-w-[1400px] mx-auto section-padding">
        <div
          ref={ref}
          className={`transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h3 className="font-heading text-2xl md:text-3xl font-semibold text-deep-brown text-center mb-3">
            You May Also Like
          </h3>
          <p className="text-sm text-muted-brown text-center mb-10 max-w-md mx-auto">
            Curated picks based on your browsing
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {recommended.map((product) => (
              <div
                key={product.id}
                className="group bg-ivory border border-border/50 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-[0_4px_20px_oklch(0.78_0.045_75/0.2)]"
              >
                <div className="relative aspect-square overflow-hidden bg-warm-beige/30">
                  <img
                    src={imgErrors[product.id] ? '/images/products/placeholder.webp' : product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={() => setImgErrors(prev => ({ ...prev, [product.id]: true }))}
                  />
                  <button
                    aria-label="Add to wishlist"
                    className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-cream/80 text-muted-brown hover:text-temple-red transition-colors"
                  >
                    <Heart className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="p-3">
                  <h4 className="text-xs font-heading font-semibold text-deep-brown line-clamp-1 mb-1">
                    {product.name}
                  </h4>
                  <div className="flex items-center gap-0.5 mb-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-2.5 h-2.5 ${
                          s <= Math.round(product.rating)
                            ? 'fill-clay text-clay'
                            : 'text-border'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-heading font-semibold text-deep-brown">
                      {formatPrice(product.price)}
                    </span>
                    <button
                      aria-label="Add to cart"
                      className="w-7 h-7 flex items-center justify-center rounded-md border border-border text-muted-brown hover:bg-temple-red hover:text-cream hover:border-temple-red transition-all duration-200"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
