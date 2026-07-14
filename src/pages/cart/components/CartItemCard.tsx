import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import type { ShopProduct } from '@/types';

interface CartItemCardProps {
  item: {
    product: ShopProduct;
    quantity: number;
  };
  onUpdateQuantity: (id: string, newQuantity: number) => void;
  onRemove: (id: string) => void;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

export function CartItemCard({ item, onUpdateQuantity, onRemove }: CartItemCardProps) {
  const { product, quantity } = item;
  const [imgLoading, setImgLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  return (
    <div className="flex gap-4 sm:gap-6 py-6 border-b border-border/50 bg-ivory sm:bg-transparent px-4 sm:px-0 rounded-lg sm:rounded-none">
      {/* Image */}
      <Link to={`/product/${product.id}`} className="relative w-24 h-28 sm:w-32 sm:h-36 shrink-0 bg-warm-beige/40 rounded-md overflow-hidden block">
        {imgLoading && (
          <div className="absolute inset-0 bg-muted-brown/10 animate-pulse" />
        )}
        <img
          src={imgError ? '/images/products/placeholder.webp' : product.image}
          alt={product.name}
          className={`w-full h-full object-cover hover:scale-105 transition-all duration-500 ${
            imgLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
          referrerPolicy="no-referrer"
          onLoad={() => setImgLoading(false)}
          onError={() => {
            setImgError(true);
            setImgLoading(false);
          }}
        />
      </Link>

      {/* Details */}
      <div className="flex-1 flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-col justify-between">
          <div>
            <Link to={`/product/${product.id}`}>
              <h3 className="text-sm sm:text-base font-heading font-semibold text-deep-brown hover:text-temple-red transition-colors mb-1">
                {product.name}
              </h3>
            </Link>
            <p className="text-xs font-body text-muted-brown mb-2">{product.material} • {product.size}</p>
            <span className="text-sm sm:text-base font-heading font-semibold text-brown block sm:hidden">
              {formatPrice(product.price)}
            </span>
          </div>

          <div className="flex items-center gap-4 mt-2 sm:mt-0">
            {/* Quantity Selector */}
            <div className="flex items-center justify-between border border-border rounded-md w-24 h-9">
              <button
                onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                className="w-8 h-full flex items-center justify-center text-brown hover:bg-warm-beige transition-colors disabled:opacity-50"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="font-body text-xs font-medium">{quantity}</span>
              <button
                onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                className="w-8 h-full flex items-center justify-center text-brown hover:bg-warm-beige transition-colors"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            {/* Remove Button */}
            <button
              onClick={() => onRemove(product.id)}
              className="text-xs font-body font-medium uppercase tracking-wider text-muted-brown hover:text-temple-red transition-colors flex items-center gap-1.5"
              aria-label="Remove item"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Remove</span>
            </button>
          </div>
        </div>

        {/* Price (Desktop) */}
        <div className="hidden sm:flex flex-col items-end justify-between">
          <span className="text-lg font-heading font-semibold text-deep-brown">
            {formatPrice(product.price)}
          </span>
          <span className="text-xs font-body text-muted-brown">
            Total: {formatPrice(product.price * quantity)}
          </span>
        </div>
      </div>
    </div>
  );
}
