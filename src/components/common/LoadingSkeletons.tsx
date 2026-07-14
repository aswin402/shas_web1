
// A simple helper for skeleton blocks
export function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-muted-brown/10 rounded-md ${className}`} />;
}

// 1. Shop Skeleton
export function ShopSkeleton() {
  return (
    <div className="bg-cream min-h-screen">

      <div className="max-w-[1400px] mx-auto section-padding pb-12">
        {/* Toolbar Skeleton */}
        <div className="flex justify-between items-center pb-4 border-b border-border/30 mb-6">
          <SkeletonBlock className="h-6 w-32" />
          <div className="flex gap-3">
            <SkeletonBlock className="h-10 w-44" />
            <SkeletonBlock className="h-10 w-24" />
          </div>
        </div>

        {/* Sidebar + Grid Skeleton */}
        <div className="flex gap-8">
          {/* Filter Sidebar Skeleton - Desktop only */}
          <div className="hidden lg:block w-64 shrink-0 space-y-6">
            <SkeletonBlock className="h-10 w-full" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2.5">
                <SkeletonBlock className="h-5 w-24" />
                {Array.from({ length: 4 }).map((_, j) => (
                  <SkeletonBlock key={j} className="h-4 w-full" />
                ))}
              </div>
            ))}
          </div>

          {/* Product Grid Skeleton */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-ivory border border-border/35 rounded-lg overflow-hidden p-4 space-y-4">
                  {/* Image skeleton */}
                  <SkeletonBlock className="aspect-[4/5] w-full" />
                  {/* Content skeleton */}
                  <div className="space-y-2">
                    <SkeletonBlock className="h-3 w-16" />
                    <SkeletonBlock className="h-5 w-4/5" />
                    <SkeletonBlock className="h-3 w-2/5" />
                    <SkeletonBlock className="h-3 w-24" />
                  </div>
                  {/* Footer skeleton */}
                  <div className="flex justify-between items-center pt-2">
                    <SkeletonBlock className="h-6 w-20" />
                    <SkeletonBlock className="h-8 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. Product Detail Skeleton
export function ProductDetailSkeleton() {
  return (
    <div className="bg-cream min-h-screen pt-6">
      <div className="max-w-[1400px] mx-auto section-padding">
        {/* Breadcrumb Skeleton */}
        <div className="flex gap-2 mb-8">
          <SkeletonBlock className="h-4 w-12" />
          <SkeletonBlock className="h-4 w-16" />
          <SkeletonBlock className="h-4 w-32" />
        </div>

        {/* Gallery + Info Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-16">
          {/* Gallery skeleton */}
          <div className="space-y-4">
            <SkeletonBlock className="aspect-square w-full rounded-lg" />
            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonBlock key={i} className="aspect-square w-full rounded" />
              ))}
            </div>
          </div>

          {/* Info skeleton */}
          <div className="space-y-6">
            <SkeletonBlock className="h-4 w-20" />
            <SkeletonBlock className="h-10 w-4/5" />
            <SkeletonBlock className="h-5 w-32" />
            <div className="border-t border-b border-border/30 py-6 space-y-4">
              <SkeletonBlock className="h-8 w-28" />
            </div>
            {/* Attributes skeleton */}
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <SkeletonBlock className="h-3 w-16" />
                  <SkeletonBlock className="h-4 w-28" />
                </div>
              ))}
            </div>
            {/* Action buttons skeleton */}
            <div className="flex gap-4 pt-4">
              <SkeletonBlock className="h-12 w-32" />
              <SkeletonBlock className="h-12 flex-1" />
              <SkeletonBlock className="h-12 w-12" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. Admin Table Skeleton (for orders/products list)
export function AdminTableSkeleton({ title, subtitle, srText }: { title: string; subtitle: string; srText?: string }) {
  return (
    <div className="space-y-8 animate-fade-up">
      {srText && <div className="sr-only">{srText}</div>}
      {/* Title block */}
      <div>
        <h1 className="text-3xl font-heading font-semibold text-deep-brown tracking-wide">
          {title}
        </h1>
        <p className="text-sm text-muted-brown uppercase tracking-widest mt-1">
          {subtitle}
        </p>
      </div>

      {/* Toolbar Skeleton */}
      <div className="bg-white border border-border/40 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        <SkeletonBlock className="h-10 w-full md:max-w-md" />
        <SkeletonBlock className="h-10 w-full md:w-44" />
      </div>

      {/* Table Skeleton */}
      <div className="bg-white border border-border/40 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border/30 bg-cream/45">
          <div className="grid grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonBlock key={i} className="h-5 w-24" />
            ))}
          </div>
        </div>
        <div className="divide-y divide-border/20">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-6 grid grid-cols-5 gap-4 items-center">
              <SkeletonBlock className="h-5 w-16" />
              <div className="space-y-1.5">
                <SkeletonBlock className="h-5 w-32" />
                <SkeletonBlock className="h-3 w-20" />
              </div>
              <SkeletonBlock className="h-5 w-24" />
              <SkeletonBlock className="h-6 w-20 rounded-full" />
              <div className="flex justify-end">
                <SkeletonBlock className="h-5 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 4. Admin Dashboard Skeleton
export function AdminDashboardSkeleton() {
  return (
    <div className="space-y-8 animate-fade-up">
      <div className="sr-only">Loading Dashboard Analytics...</div>
      
      {/* Page Header */}
      <div>
        <SkeletonBlock className="h-9 w-64" />
        <SkeletonBlock className="h-4 w-96 mt-2" />
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white border border-border/40 p-6 rounded-xl space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <SkeletonBlock className="h-4 w-28" />
              <SkeletonBlock className="h-10 w-10 rounded-lg" />
            </div>
            <SkeletonBlock className="h-8 w-20" />
            <SkeletonBlock className="h-3 w-36" />
          </div>
        ))}
      </div>

      {/* Main Grid: Low Stock & Recent Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Box: Low Stock */}
        <div className="bg-white border border-border/40 rounded-xl p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/10 pb-4">
            <div className="space-y-2">
              <SkeletonBlock className="h-6 w-44" />
              <SkeletonBlock className="h-3 w-32" />
            </div>
            <SkeletonBlock className="h-4 w-28" />
          </div>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center p-4 bg-cream/35 border border-border/20 rounded-lg">
                <div className="space-y-2">
                  <SkeletonBlock className="h-4 w-36" />
                  <SkeletonBlock className="h-3 w-20" />
                </div>
                <div className="space-y-2 text-right">
                  <SkeletonBlock className="h-4 w-16" />
                  <SkeletonBlock className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Box: Recent Inquiries */}
        <div className="bg-white border border-border/40 rounded-xl p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/10 pb-4">
            <div className="space-y-2">
              <SkeletonBlock className="h-6 w-32" />
              <SkeletonBlock className="h-3 w-24" />
            </div>
            <SkeletonBlock className="h-4 w-28" />
          </div>
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="p-4 bg-cream/35 border border-border/20 rounded-lg space-y-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <SkeletonBlock className="h-4 w-28" />
                    <SkeletonBlock className="h-3 w-36" />
                  </div>
                  <SkeletonBlock className="h-3 w-16" />
                </div>
                <SkeletonBlock className="h-3 w-20" />
                <SkeletonBlock className="h-10 w-full rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// 5. Product Grid Skeleton (without filters/sidebar, for Search, Wishlist, or Related/Featured Grids)
export function ProductGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-ivory border border-border/35 rounded-lg overflow-hidden p-4 space-y-4">
          <SkeletonBlock className="aspect-[4/5] w-full" />
          <div className="space-y-2">
            <SkeletonBlock className="h-3 w-16" />
            <SkeletonBlock className="h-5 w-4/5" />
            <SkeletonBlock className="h-3 w-2/5" />
            <SkeletonBlock className="h-3 w-24" />
          </div>
          <div className="flex justify-between items-center pt-2">
            <SkeletonBlock className="h-6 w-20" />
            <SkeletonBlock className="h-8 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

// 6. Cart Skeleton
export function CartSkeleton() {
  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-[1400px] mx-auto section-padding pb-12">
        {/* Breadcrumb Skeleton */}
        <div className="flex gap-2 mb-8">
          <SkeletonBlock className="h-4 w-12" />
          <SkeletonBlock className="h-4 w-16" />
          <SkeletonBlock className="h-4 w-32" />
        </div>
        
        <SkeletonBlock className="h-10 w-48 mb-8" />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items skeleton */}
          <div className="lg:col-span-2 space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex gap-4 p-4 bg-white border border-border/30 rounded-lg">
                <SkeletonBlock className="w-24 h-28 rounded-md shrink-0" />
                <div className="flex-1 space-y-2">
                  <SkeletonBlock className="h-4 w-20" />
                  <SkeletonBlock className="h-5 w-40" />
                  <SkeletonBlock className="h-4 w-16" />
                </div>
                <div className="space-y-4 text-right">
                  <SkeletonBlock className="h-5 w-16" />
                  <SkeletonBlock className="h-8 w-8 rounded-full" />
                </div>
              </div>
            ))}
          </div>
          
          {/* Order Summary skeleton */}
          <div className="bg-white border border-border/30 rounded-lg p-6 space-y-6">
            <SkeletonBlock className="h-6 w-32" />
            <div className="space-y-3">
              <div className="flex justify-between">
                <SkeletonBlock className="h-4 w-16" />
                <SkeletonBlock className="h-4 w-12" />
              </div>
              <div className="flex justify-between">
                <SkeletonBlock className="h-4 w-20" />
                <SkeletonBlock className="h-4 w-12" />
              </div>
            </div>
            <div className="border-t border-border/30 pt-4 flex justify-between">
              <SkeletonBlock className="h-5 w-16" />
              <SkeletonBlock className="h-5 w-20" />
            </div>
            <SkeletonBlock className="h-12 w-full rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

