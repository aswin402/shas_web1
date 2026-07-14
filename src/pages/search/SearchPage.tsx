import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useProductsQuery } from '@/hooks/useProducts';
import type { ShopProduct } from '@/types';
import { ShopProductCard } from '@/pages/shop/sections/ShopProductCard';
import { TrustStrip } from '@/components/common/TrustStrip';
import { EmptySearch } from './components/EmptySearch';
import { ProductGridSkeleton } from '@/components/common/LoadingSkeletons';

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);

  const { data: dbProducts = [], isLoading } = useProductsQuery();

  const mappedProducts: ShopProduct[] = useMemo(() => {
    return (dbProducts || []).map((dbProduct: any) => ({
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
  }, [dbProducts]);

  // Update URL when user stops typing (simple debounce effect by pushing state)
  useEffect(() => {
    const handler = setTimeout(() => {
      if (query) {
        setSearchParams({ q: query });
      } else {
        setSearchParams({});
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [query, setSearchParams]);

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return [];
    
    const lowerQuery = query.toLowerCase();
    return mappedProducts.filter((product) => 
      product.name.toLowerCase().includes(lowerQuery) ||
      product.category.toLowerCase().includes(lowerQuery) ||
      product.material.toLowerCase().includes(lowerQuery)
    );
  }, [query, mappedProducts]);

  return (
    <main className="bg-cream pt-6 pb-0 min-h-screen flex flex-col">
      <div className="max-w-[1400px] mx-auto section-padding w-full flex-1">
        
        {/* Search Input Area */}
        <div className="max-w-3xl mx-auto mt-4 mb-12 animate-fade-up">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for divine art, materials, or categories..."
              className="w-full h-16 pl-16 pr-6 bg-ivory border-2 border-border/50 rounded-full text-lg font-body text-brown focus:border-temple-red focus:ring-4 focus:ring-temple-red/10 outline-none transition-all shadow-sm"
              autoFocus
            />
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-brown" />
          </div>
          {query.trim() && (
            <p className="text-center text-sm font-body text-muted-brown mt-4">
              Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'result' : 'results'} for "{query}"
            </p>
          )}
        </div>

        {/* Results Area */}
        {isLoading && query.trim() ? (
          <div className="mb-16 md:mb-24">
            <ProductGridSkeleton count={4} />
          </div>
        ) : !query.trim() ? (
          <div className="min-h-[40vh] flex flex-col items-center justify-center text-center animate-fade-up opacity-50">
             <Search className="w-12 h-12 text-border mb-4" />
             <p className="font-heading text-xl text-muted-brown">Start typing to search our collection</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <EmptySearch query={query} />
        ) : (
          <div className="mb-16 md:mb-24">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
              {filteredProducts.map((product, index) => (
                <div key={product.id} className="animate-fade-up" style={{ animationDelay: `${index * 50}ms` }}>
                  <ShopProductCard product={product} viewMode="grid" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Trust Strip at bottom */}
      <div className="mt-auto border-t border-border/50">
        <TrustStrip />
      </div>
    </main>
  );
}
