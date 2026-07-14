import { useState } from 'react';
import { Heart, ShoppingBag, Star, Share2, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import type { ShopProduct } from '@/types';
import { useAppStore } from '@/store/useAppStore';

interface ProductInfoProps {
  product: ShopProduct;
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
          className={`w-4 h-4 ${
            star <= Math.round(rating)
              ? 'fill-clay text-clay'
              : 'text-border'
          }`}
        />
      ))}
    </div>
  );
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const addToCart = useAppStore((state) => state.addToCart);
  const toggleWishlist = useAppStore((state) => state.toggleWishlist);
  const wishlist = useAppStore((state) => state.wishlist);

  const isWishlisted = wishlist.includes(product.id);

  const increment = () => setQuantity(q => q + 1);
  const decrement = () => setQuantity(q => Math.max(1, q - 1));

  return (
    <div className="flex flex-col">
      {/* Eyebrow / Category */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-body uppercase tracking-[0.15em] text-temple-red">
          {product.category}
        </p>
        <button 
          aria-label="Share product"
          className="w-8 h-8 flex items-center justify-center rounded-full text-muted-brown hover:bg-warm-beige hover:text-temple-red transition-colors"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-semibold text-deep-brown mb-4 leading-tight">
        {product.name}
      </h1>

      {/* Ratings */}
      <div className="flex items-center gap-3 mb-6">
        <RatingStars rating={product.rating} />
        <span className="text-sm font-body text-muted-brown">
          {product.rating} ({product.reviewCount} reviews)
        </span>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-4 mb-6 pb-6 border-b border-border/50">
        <span className="text-3xl font-heading font-semibold text-deep-brown">
          {formatPrice(product.price)}
        </span>
        {product.originalPrice && (
          <span className="text-lg font-body text-muted-brown line-through">
            {formatPrice(product.originalPrice)}
          </span>
        )}
        {product.originalPrice && (
          <span className="text-xs font-body font-semibold uppercase tracking-wider text-temple-red bg-temple-red/10 px-2 py-1 rounded-sm ml-auto sm:ml-0">
            Save {formatPrice(product.originalPrice - product.price)}
          </span>
        )}
      </div>

      {/* Attributes */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div>
          <p className="text-xs font-body font-medium uppercase tracking-wider text-muted-brown mb-1">Material</p>
          <p className="text-sm font-body text-brown">{product.material}</p>
        </div>
        <div>
          <p className="text-xs font-body font-medium uppercase tracking-wider text-muted-brown mb-1">Size</p>
          <p className="text-sm font-body text-brown">{product.size}</p>
        </div>
        <div>
          <p className="text-xs font-body font-medium uppercase tracking-wider text-muted-brown mb-1">Color / Finish</p>
          <p className="text-sm font-body text-brown">{product.colorFinish}</p>
        </div>
        <div>
          <p className="text-xs font-body font-medium uppercase tracking-wider text-muted-brown mb-1">Availability</p>
          <p className={`text-sm font-body font-medium ${product.inStock ? 'text-green-700' : 'text-temple-red'}`}>
            {product.availability}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* Quantity */}
        <div className="flex items-center justify-between border border-border rounded-md w-full sm:w-32 h-12 shrink-0">
          <button 
            onClick={decrement}
            className="w-10 h-full flex items-center justify-center text-brown hover:bg-warm-beige transition-colors"
            aria-label="Decrease quantity"
          >
            -
          </button>
          <span className="font-body text-sm font-medium">{quantity}</span>
          <button 
            onClick={increment}
            className="w-10 h-full flex items-center justify-center text-brown hover:bg-warm-beige transition-colors"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        {/* Add to Cart */}
        <button 
          onClick={() => addToCart(product.id, quantity)}
          className="flex-1 h-12 flex items-center justify-center gap-2 bg-temple-red text-cream font-body font-semibold uppercase tracking-[0.12em] text-xs rounded-md hover:bg-deep-red transition-all duration-300 active:scale-[0.98]"
        >
          <ShoppingBag className="w-4 h-4" />
          Add to Cart
        </button>

        {/* Wishlist */}
        <button 
          onClick={() => toggleWishlist(product.id)}
          className={`w-12 h-12 flex items-center justify-center shrink-0 border rounded-md transition-all duration-300 active:scale-[0.98] ${
            isWishlisted ? 'border-temple-red bg-temple-red/5' : 'border-border hover:border-temple-red hover:bg-warm-beige'
          }`}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-temple-red text-temple-red' : 'text-brown'}`} />
        </button>
      </div>

      {/* Mini Trust Badges */}
      <div className="bg-warm-beige/50 rounded-lg p-4 grid gap-3">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-clay shrink-0" />
          <p className="text-sm font-body text-brown">Secure checkout & SSL Encrypted</p>
        </div>
        <div className="flex items-center gap-3">
          <Truck className="w-5 h-5 text-clay shrink-0" />
          <p className="text-sm font-body text-brown">Free shipping on orders over ₹5000</p>
        </div>
        <div className="flex items-center gap-3">
          <RotateCcw className="w-5 h-5 text-clay shrink-0" />
          <p className="text-sm font-body text-brown">7-day easy return policy</p>
        </div>
      </div>
    </div>
  );
}
