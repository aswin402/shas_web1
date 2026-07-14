import { Heart } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '@/types';
import { LazyImage } from './LazyImage';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="group relative bg-ivory border border-border rounded-lg overflow-hidden transition-all duration-300 hover:shadow-[0_4px_24px_oklch(0.78_0.045_75/0.3)] flex flex-col h-full">
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-warm-beige">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <LazyImage
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        </Link>

        {/* Badge */}
        {product.badge && (
          <span className="absolute top-3 left-3 pointer-events-none px-3 py-1 text-[10px] font-body font-semibold uppercase tracking-[0.12em] bg-temple-red text-cream rounded-sm z-10">
            {product.badge}
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-cream/80 backdrop-blur-sm transition-all duration-200 hover:bg-cream"
        >
          <Heart
            className={`w-4 h-4 transition-colors duration-200 ${
              isWishlisted
                ? 'fill-temple-red text-temple-red'
                : 'text-muted-brown'
            }`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <Link to={`/product/${product.id}`} className="block mb-1">
          <h3 className="text-[11px] font-body font-semibold uppercase tracking-[0.12em] text-brown line-clamp-1 hover:text-temple-red transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-muted-brown mb-3">{product.material}</p>

        <div className="flex items-center gap-2 mb-4 mt-auto">
          <span className="text-base font-heading font-semibold text-deep-brown">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-brown line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        <button className="w-full py-2.5 text-[11px] font-body font-semibold uppercase tracking-[0.12em] border border-border text-brown rounded-md transition-all duration-300 hover:bg-temple-red hover:text-cream hover:border-temple-red active:scale-[0.98]">
          Add to Cart
        </button>
      </div>
    </div>
  );
}
