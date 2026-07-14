import { Link } from 'react-router-dom';
import { ChevronRight, SlidersHorizontal, LayoutGrid, List } from 'lucide-react';
import { sortOptions } from '@/data/shopData';

interface ShopToolbarProps {
  totalProducts: number;
  currentSort: string;
  onSortChange: (value: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onOpenFilters: () => void;
}

export function ShopToolbar({
  totalProducts,
  currentSort,
  onSortChange,
  viewMode,
  onViewModeChange,
  onOpenFilters,
}: ShopToolbarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between py-4 md:py-5 border-b border-border/50">
      {/* Left: Breadcrumb + Count */}
      <div className="flex flex-col gap-1.5">
        <nav className="flex items-center gap-1.5 text-xs font-body text-muted-brown">
          <Link to="/" className="hover:text-temple-red transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-brown font-medium">Shop</span>
        </nav>
        <p className="text-sm text-muted-brown">
          Showing{' '}
          <span className="font-medium text-brown">1–{Math.min(12, totalProducts)}</span> of{' '}
          <span className="font-medium text-brown">{totalProducts}</span> pieces
        </p>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Mobile Filter Button */}
        <button
          onClick={onOpenFilters}
          className="lg:hidden flex items-center gap-2 px-4 py-2 text-xs font-body font-semibold uppercase tracking-[0.1em] border border-border text-brown rounded-md hover:border-temple-red hover:text-temple-red transition-all"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filters
        </button>

        {/* Sort Dropdown */}
        <div className="relative">
          <select
            value={currentSort}
            onChange={(e) => onSortChange(e.target.value)}
            className="appearance-none bg-cream border border-border rounded-md px-3 py-2 pr-8 text-xs font-body text-brown cursor-pointer hover:border-temple-red/50 focus:border-temple-red focus:outline-none transition-colors"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronRight className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-brown rotate-90 pointer-events-none" />
        </div>

        {/* View Toggle */}
        <div className="hidden sm:flex items-center border border-border rounded-md overflow-hidden">
          <button
            onClick={() => onViewModeChange('grid')}
            aria-label="Grid view"
            className={`p-2 transition-colors ${
              viewMode === 'grid'
                ? 'bg-temple-red text-cream'
                : 'text-muted-brown hover:text-brown'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            aria-label="List view"
            className={`p-2 transition-colors ${
              viewMode === 'list'
                ? 'bg-temple-red text-cream'
                : 'text-muted-brown hover:text-brown'
            }`}
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
