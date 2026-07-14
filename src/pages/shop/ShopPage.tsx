import { useState, useCallback, useEffect } from 'react';
import { useProductsQuery } from '@/hooks/useProducts';
import type { ShopProduct } from '@/types';
import { ShopSkeleton } from '@/components/common/LoadingSkeletons';
import { ShopToolbar } from './sections/ShopToolbar';
import { FilterSidebar } from './sections/FilterSidebar';
import { MobileFilterDrawer } from './sections/MobileFilterDrawer';
import { ShopProductCard } from './sections/ShopProductCard';
import { ActiveFilters } from './sections/ActiveFilters';
import { PromoBanner } from './sections/PromoBanner';
import { Pagination } from './sections/Pagination';
import { RecentlyViewed } from './sections/RecentlyViewed';
import { TrustStrip } from './sections/TrustStrip';

export function ShopPage() {
  // Filter state
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(
    {}
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSort, setCurrentSort] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Scroll to top of page when filters, search query, sorting, or pagination changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, activeFilters, searchQuery, currentSort]);

  const handleFilterChange = useCallback(
    (groupId: string, value: string) => {
      setActiveFilters((prev) => {
        const current = prev[groupId] || [];
        const exists = current.includes(value);
        return {
          ...prev,
          [groupId]: exists
            ? current.filter((v) => v !== value)
            : [...current, value],
        };
      });
      setCurrentPage(1);
    },
    []
  );

  const handleRemoveFilter = useCallback(
    (groupId: string, value: string) => {
      setActiveFilters((prev) => ({
        ...prev,
        [groupId]: (prev[groupId] || []).filter((v) => v !== value),
      }));
      setCurrentPage(1);
    },
    []
  );

  const handleClearAll = useCallback(() => {
    setActiveFilters({});
    setSearchQuery('');
    setCurrentPage(1);
  }, []);

  const { data: dbProducts = [], isLoading, error } = useProductsQuery();

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

  // Client-side filtering & sorting to match UI filter actions
  let filteredProducts = mappedProducts;

  // Search filter
  if (searchQuery) {
    filteredProducts = filteredProducts.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Category filter
  const selectedCategories = activeFilters['category'] || [];
  if (selectedCategories.length > 0) {
    filteredProducts = filteredProducts.filter((p) => {
      const catSlug = p.category.toLowerCase().replace(/\s+/g, '-');
      return selectedCategories.some(cat => 
        catSlug.includes(cat.replace('-collection', '')) ||
        cat.replace('-collection', '').includes(catSlug)
      );
    });
  }

  // Material filter
  const selectedMaterials = activeFilters['material'] || [];
  if (selectedMaterials.length > 0) {
    filteredProducts = filteredProducts.filter((p) =>
      selectedMaterials.some(m => p.material.toLowerCase().includes(m.toLowerCase()))
    );
  }

  // Usage filter
  const selectedUsage = activeFilters['usage'] || [];
  if (selectedUsage.length > 0) {
    filteredProducts = filteredProducts.filter((p) =>
      selectedUsage.some(u => p.usage.toLowerCase().replace(/\s+/g, '-').includes(u.toLowerCase()))
    );
  }

  // Size filter
  const selectedSizes = activeFilters['size'] || [];
  if (selectedSizes.length > 0) {
    filteredProducts = filteredProducts.filter((p) =>
      selectedSizes.some(s => p.size.toLowerCase().includes(s.toLowerCase()))
    );
  }

  // Sorting
  if (currentSort === 'price-asc') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (currentSort === 'price-desc') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (currentSort === 'highest-rated') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.rating - a.rating);
  }

  const products = filteredProducts;
  const totalPages = Math.max(1, Math.ceil(products.length / 12));

  // Paginate products
  const startIndex = (currentPage - 1) * 12;
  const paginatedProducts = products.slice(startIndex, startIndex + 12);

  // Split paginated products into two rows for the promo banner insertion
  const firstRow = paginatedProducts.slice(0, 6);
  const secondRow = paginatedProducts.slice(6);

  if (isLoading) {
    return <ShopSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center section-padding bg-cream">
        <h2 className="text-2xl font-heading font-semibold text-deep-brown mb-2">Failed to Load Products</h2>
        <p className="text-muted-brown font-body mb-6">{(error as any)?.message || 'Something went wrong.'}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 bg-temple-red text-cream font-body font-semibold uppercase tracking-widest text-xs rounded hover:bg-deep-red transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Main Shop Layout */}
      <section className="bg-cream">
        <div className="max-w-[1400px] mx-auto section-padding pb-0">
          {/* Toolbar */}
          <ShopToolbar
            totalProducts={products.length}
            currentSort={currentSort}
            onSortChange={setCurrentSort}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onOpenFilters={() => setIsFilterDrawerOpen(true)}
          />

          {/* Active Filters */}
          <ActiveFilters
            activeFilters={activeFilters}
            onRemoveFilter={handleRemoveFilter}
            onClearAll={handleClearAll}
          />

          {/* Sidebar + Product Grid */}
          <div className="flex gap-6 lg:gap-8 pt-6 pb-12">
            {/* Filter Sidebar — Desktop only */}
            <div className="hidden lg:block">
              <FilterSidebar
                activeFilters={activeFilters}
                onFilterChange={handleFilterChange}
                onClearAll={handleClearAll}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            </div>

            {/* Product Grid */}
            <div className="flex-1 min-w-0">
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
                  {/* First 6 products */}
                  {firstRow.map((product) => (
                    <ShopProductCard
                      key={product.id}
                      product={product}
                      viewMode="grid"
                    />
                  ))}

                  {/* Promo Banner */}
                  <PromoBanner />

                  {/* Remaining products */}
                  {secondRow.map((product) => (
                    <ShopProductCard
                      key={product.id}
                      product={product}
                      viewMode="grid"
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {firstRow.map((product) => (
                    <ShopProductCard
                      key={product.id}
                      product={product}
                      viewMode="list"
                    />
                  ))}
                  <PromoBanner />
                  {secondRow.map((product) => (
                    <ShopProductCard
                      key={product.id}
                      product={product}
                      viewMode="list"
                    />
                  ))}
                </div>
              )}

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Recently Viewed */}
      <RecentlyViewed />

      {/* Trust Strip */}
      <TrustStrip />

      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        onClearAll={handleClearAll}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
    </>
  );
}
