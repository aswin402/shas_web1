import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useProductDetailQuery } from '@/hooks/useProducts';
import type { ShopProduct } from '@/types';
import { ProductDetailSkeleton } from '@/components/common/LoadingSkeletons';
import { ProductGallery } from './sections/ProductGallery';
import { ProductInfo } from './sections/ProductInfo';
import { ProductDetailsTabs } from './sections/ProductDetailsTabs';
import { RelatedProducts } from './sections/RelatedProducts';
import { RecentlyViewed } from '@/pages/shop/sections/RecentlyViewed';
import { TrustStrip } from '@/components/common/TrustStrip';

export function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { data: dbProduct, isLoading, error } = useProductDetailQuery(id || '');

  // Scroll to top on mount or when product changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [id]);

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (error || !dbProduct) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center section-padding bg-cream">
        <h1 className="text-3xl font-heading font-semibold text-deep-brown mb-4">Product Not Found</h1>
        <p className="text-muted-brown font-body mb-8">We couldn't find the product you're looking for.</p>
        <Link 
          to="/shop" 
          className="px-8 py-3 bg-temple-red text-cream font-body font-semibold uppercase tracking-widest text-xs rounded hover:bg-deep-red transition-colors"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  const product: ShopProduct = {
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
  };

  return (
    <main className="bg-cream pt-6 pb-0">
      <div className="max-w-[1400px] mx-auto section-padding">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-body uppercase tracking-wider text-muted-brown mb-8 md:mb-12 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
          <Link to="/" className="flex items-center gap-1.5 hover:text-temple-red transition-colors">
            <Home className="w-3.5 h-3.5 mb-0.5" />
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <Link to="/shop" className="hover:text-temple-red transition-colors">
            Shop
          </Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <span className="text-brown font-medium max-w-[200px] sm:max-w-none truncate">
            {product.name}
          </span>
        </nav>

        {/* Hero Section: Gallery + Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-16 md:mb-24">
          <div className="animate-fade-up">
            <ProductGallery image={product.image} name={product.name} />
          </div>
          <div className="animate-fade-up" style={{ animationDelay: '100ms' }}>
            <ProductInfo product={product} />
          </div>
        </div>

        {/* Product Details Tabs / Accordion */}
        <div className="mb-16 md:mb-24">
          <ProductDetailsTabs product={product} />
        </div>

        {/* Related Products */}
        <div className="mb-16 md:mb-24">
          <RelatedProducts currentProduct={product} />
        </div>
      </div>

      {/* Cross-sell / Reassurance */}
      <TrustStrip />
      
      {/* Recently Viewed */}
      <RecentlyViewed />
    </main>
  );
}
