import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { ShopProductCard } from '@/pages/shop/sections/ShopProductCard';
import { TrustStrip } from '@/components/common/TrustStrip';
import { EmptyWishlist } from './components/EmptyWishlist';
import { useAppStore } from '@/store/useAppStore';
import { useProductsQuery } from '@/hooks/useProducts';
import { ProductGridSkeleton } from '@/components/common/LoadingSkeletons';

export function WishlistPage() {
  const { data: dbProducts = [], isLoading } = useProductsQuery();
  const wishlist = useAppStore(state => state.wishlist);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  if (isLoading) {
    return (
      <main className="bg-cream pt-6 pb-0 min-h-screen">
        <div className="max-w-[1400px] mx-auto section-padding">
          <div className="flex items-center gap-2 text-xs font-body uppercase tracking-wider text-muted-brown mb-8 md:mb-12">
            <Home className="w-3.5 h-3.5 mb-0.5" />
            Home
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-brown font-medium">My Wishlist</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-semibold text-deep-brown mb-8 md:mb-12">
            My Wishlist
          </h1>
          <ProductGridSkeleton count={4} />
        </div>
      </main>
    );
  }

  const wishlistItems = dbProducts
    .filter(p => wishlist.includes(p.id))
    .map(product => ({
      id: product.id,
      name: product.name,
      category: product.category || '',
      price: Number(product.price),
      originalPrice: product.price ? Math.round(Number(product.price) * 1.2) : undefined,
      image: product.image_url || '',
      badge: product.badge,
      rating: Number(product.rating || 0),
      reviewCount: product.reviews_count || 0,
      usage: product.details?.usage || '',
      size: product.details?.dimensions || '',
      material: product.details?.material || '',
      colorFinish: product.details?.colorFinish || '',
      availability: ((product.stock ?? 0) > 0 ? 'In Stock' : 'Made to Order') as 'In Stock' | 'Back in Stock' | 'Made to Order',
      inStock: (product.stock ?? 0) > 0,
    }));

  return (
    <main className="bg-cream pt-6 pb-0 min-h-screen flex flex-col">
      <div className="max-w-[1400px] mx-auto section-padding w-full flex-1">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-body uppercase tracking-wider text-muted-brown mb-8 md:mb-12">
          <Link to="/" className="flex items-center gap-1.5 hover:text-temple-red transition-colors">
            <Home className="w-3.5 h-3.5 mb-0.5" />
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-brown font-medium">My Wishlist</span>
        </nav>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-semibold text-deep-brown mb-8 md:mb-12">
          My Wishlist
        </h1>

        {wishlistItems.length === 0 ? (
          <EmptyWishlist />
        ) : (
          <div className="mb-16 md:mb-24">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
              {wishlistItems.map((product, index) => (
                <div key={product.id} className="animate-fade-up" style={{ animationDelay: `${index * 50}ms` }}>
                  <ShopProductCard product={product} viewMode="grid" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Trust Strip at bottom */}
      <div className="mt-auto">
        <TrustStrip />
      </div>
    </main>
  );
}
