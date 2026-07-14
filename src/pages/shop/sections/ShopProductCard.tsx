import { useState } from 'react';
import { Heart, Eye, Star, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ShopProduct } from '@/types';
import { useAppStore } from '@/store/useAppStore';

interface ShopProductCardProps {
  product: ShopProduct;
  viewMode?: 'grid' | 'list';
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-3 h-3 ${
            star <= Math.round(rating)
              ? 'fill-clay text-clay'
              : 'text-border'
          }`}
        />
      ))}
    </div>
  );
}

export function ShopProductCard({ product, viewMode = 'grid' }: ShopProductCardProps) {
  const [imgLoading, setImgLoading] = useState(true);
  const [imgError, setImgError] = useState(false);
  const addToCart = useAppStore((state) => state.addToCart);
  const toggleWishlist = useAppStore((state) => state.toggleWishlist);
  const wishlist = useAppStore((state) => state.wishlist);

  const isWishlisted = wishlist.includes(product.id);

  if (viewMode === 'list') {
    return (
      <div className="group flex gap-4 md:gap-6 bg-ivory border border-border/50 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-[0_4px_24px_oklch(0.78_0.045_75/0.25)]">
        {/* Image */}
        <Link to={`/product/${product.id}`} className="relative w-32 sm:w-44 md:w-52 shrink-0 overflow-hidden bg-warm-beige/30 block">
          {imgLoading && (
            <div className="absolute inset-0 bg-muted-brown/10 animate-pulse" />
          )}
          <img
            src={imgError ? '/images/products/placeholder.webp' : product.image}
            alt={product.name}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
              imgLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
            }`}
            loading="lazy"
            referrerPolicy="no-referrer"
            onLoad={() => setImgLoading(false)}
            onError={() => {
              setImgError(true);
              setImgLoading(false);
            }}
          />
          {product.badge && (
            <span className="absolute top-2 left-2 px-2.5 py-0.5 text-[9px] font-body font-semibold uppercase tracking-[0.1em] bg-temple-red text-cream rounded-sm">
              {product.badge}
            </span>
          )}
        </Link>

        {/* Content */}
        <div className="flex-1 py-4 pr-4 flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-body uppercase tracking-[0.12em] text-temple-red mb-1">
              {product.category}
            </p>
            <Link to={`/product/${product.id}`}>
              <h3 className="text-sm sm:text-base font-heading font-semibold text-deep-brown mb-1 hover:text-temple-red transition-colors">
                {product.name}
              </h3>
            </Link>
            <p className="text-xs text-muted-brown mb-2">{product.material}</p>
            <div className="flex items-center gap-2 mb-3">
              <RatingStars rating={product.rating} />
              <span className="text-[10px] text-muted-brown">
                ({product.reviewCount})
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-lg font-heading font-semibold text-deep-brown">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-muted-brown line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            <button 
              onClick={() => addToCart(product.id, 1)}
              className="px-4 py-2 text-[10px] font-body font-semibold uppercase tracking-[0.1em] border border-border text-brown rounded-md hover:bg-temple-red hover:text-cream hover:border-temple-red transition-all duration-300"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative bg-ivory border border-border/50 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-[0_4px_24px_oklch(0.78_0.045_75/0.25)]">
      {/* Image Container */}
      <Link to={`/product/${product.id}`} className="relative aspect-[4/5] overflow-hidden bg-warm-beige/40 block">
        {imgLoading && (
          <div className="absolute inset-0 bg-muted-brown/10 animate-pulse" />
        )}
        <img
          src={imgError ? '/images/products/placeholder.webp' : product.image}
          alt={product.name}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
            imgLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
          loading="lazy"
          referrerPolicy="no-referrer"
          onLoad={() => setImgLoading(false)}
          onError={() => {
            setImgError(true);
            setImgLoading(false);
          }}
        />

        {/* Badge */}
        {product.badge && (
          <span className="absolute top-3 left-3 px-3 py-1 text-[10px] font-body font-semibold uppercase tracking-[0.12em] bg-temple-red text-cream rounded-sm">
            {product.badge}
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={() => toggleWishlist(product.id)}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-cream/80 backdrop-blur-sm transition-all duration-200 hover:bg-cream"
        >
          <Heart
            className={`w-4 h-4 transition-colors duration-200 ${
              isWishlisted
                ? 'fill-temple-red text-temple-red'
                : 'text-muted-brown'
            }`}
          />
        </button>

        {/* Quick View — appears on hover (desktop) */}
        <button
          aria-label="Quick view"
          className="absolute bottom-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-cream/90 backdrop-blur-sm text-muted-brown opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:text-temple-red"
        >
          <Eye className="w-4 h-4" />
        </button>
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <p className="text-[10px] font-body uppercase tracking-[0.12em] text-temple-red mb-1.5">
          {product.category}
        </p>

        {/* Name */}
        <Link to={`/product/${product.id}`}>
          <h3 className="text-[13px] font-heading font-semibold text-deep-brown mb-1 line-clamp-1 hover:text-temple-red transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Material */}
        <p className="text-xs text-muted-brown mb-2">{product.material}</p>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <RatingStars rating={product.rating} />
          <span className="text-[10px] text-muted-brown">
            ({product.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-base font-heading font-semibold text-deep-brown">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-brown line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Add to Cart */}
        <button 
          onClick={() => addToCart(product.id, 1)}
          className="w-full flex items-center justify-center gap-2 py-2.5 text-[11px] font-body font-semibold uppercase tracking-[0.12em] border border-border text-brown rounded-md transition-all duration-300 hover:bg-temple-red hover:text-cream hover:border-temple-red active:scale-[0.98]"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
