import { ShopProductCard } from '@/pages/shop/sections/ShopProductCard';
import { shopProducts } from '@/data/shopData';
import type { ShopProduct } from '@/types';

interface RelatedProductsProps {
  currentProduct: ShopProduct;
}

export function RelatedProducts({ currentProduct }: RelatedProductsProps) {
  // Simple related products logic: Match category, then fallback to others, exclude current product
  let related = shopProducts.filter(p => p.id !== currentProduct.id && p.category === currentProduct.category);
  
  if (related.length < 4) {
    const additional = shopProducts.filter(p => p.id !== currentProduct.id && !related.includes(p));
    related = [...related, ...additional].slice(0, 4);
  } else {
    related = related.slice(0, 4);
  }

  return (
    <div className="pt-8 md:pt-12 border-t border-border/50 mt-16">
      <h2 className="text-2xl md:text-3xl font-heading font-semibold text-deep-brown mb-8 text-center md:text-left">
        You May Also Like
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {related.map(product => (
          <ShopProductCard key={product.id} product={product} viewMode="grid" />
        ))}
      </div>
    </div>
  );
}
