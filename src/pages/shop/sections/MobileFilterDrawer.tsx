import { X } from 'lucide-react';
import { FilterSidebar } from './FilterSidebar';

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeFilters: Record<string, string[]>;
  onFilterChange: (groupId: string, value: string) => void;
  onClearAll: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function MobileFilterDrawer({
  isOpen,
  onClose,
  activeFilters,
  onFilterChange,
  onClearAll,
  searchQuery,
  onSearchChange,
}: MobileFilterDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-dark-luxury/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="absolute bottom-0 left-0 right-0 max-h-[85dvh] bg-cream rounded-t-2xl overflow-hidden animate-fade-up">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 bg-cream border-b border-border/50">
          <h3 className="text-sm font-body font-semibold uppercase tracking-[0.15em] text-brown">
            Filters
          </h3>
          <button
            onClick={onClose}
            aria-label="Close filters"
            className="w-8 h-8 flex items-center justify-center rounded-full text-muted-brown hover:text-brown hover:bg-warm-beige transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(85dvh-60px)] p-1">
          <FilterSidebar
            activeFilters={activeFilters}
            onFilterChange={onFilterChange}
            onClearAll={onClearAll}
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
          />
        </div>
      </div>
    </div>
  );
}
