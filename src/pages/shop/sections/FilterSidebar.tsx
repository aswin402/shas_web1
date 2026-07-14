import { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { filterGroups } from '@/data/shopData';
import type { FilterGroup } from '@/types';

interface FilterSidebarProps {
  activeFilters: Record<string, string[]>;
  onFilterChange: (groupId: string, value: string) => void;
  onClearAll: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

function FilterSection({
  group,
  activeValues,
  onToggle,
  isOpen,
  onToggleSection,
}: {
  group: FilterGroup;
  activeValues: string[];
  onToggle: (value: string) => void;
  isOpen: boolean;
  onToggleSection: () => void;
}) {
  return (
    <div className="border-b border-border/40 last:border-b-0">
      <button
        onClick={onToggleSection}
        className="w-full flex items-center justify-between py-3.5 text-left"
      >
        <span className="text-[11px] font-body font-semibold uppercase tracking-[0.15em] text-brown">
          {group.title}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-muted-brown transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="pb-4 space-y-1.5">
          {group.type === 'chip' ? (
            <div className="flex flex-wrap gap-2">
              {group.options.map((opt) => {
                const isActive = activeValues.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    onClick={() => onToggle(opt.value)}
                    className={`px-3 py-1.5 text-[11px] font-body rounded-full border transition-all duration-200 ${
                      isActive
                        ? 'bg-temple-red text-cream border-temple-red'
                        : 'bg-cream text-muted-brown border-border hover:border-temple-red/50 hover:text-brown'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          ) : group.type === 'color' ? (
            <div className="flex flex-wrap gap-2">
              {group.options.map((opt) => {
                const isActive = activeValues.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    onClick={() => onToggle(opt.value)}
                    className={`px-2.5 py-1.5 text-[10px] font-body rounded-md border transition-all duration-200 ${
                      isActive
                        ? 'bg-temple-red/10 text-temple-red border-temple-red font-medium'
                        : 'bg-cream text-muted-brown border-border hover:border-clay'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          ) : (
            group.options.map((opt) => {
              const isActive = activeValues.includes(opt.value);
              return (
                <label
                  key={opt.value}
                  className="flex items-center gap-2.5 py-1 cursor-pointer group"
                >
                  <span
                    className={`w-4 h-4 rounded border-[1.5px] flex items-center justify-center shrink-0 transition-all duration-200 ${
                      isActive
                        ? 'bg-temple-red border-temple-red'
                        : 'border-border group-hover:border-clay'
                    }`}
                  >
                    {isActive && (
                      <svg
                        className="w-2.5 h-2.5 text-cream"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </span>
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={() => onToggle(opt.value)}
                    className="sr-only"
                  />
                  <span
                    className={`text-sm font-body transition-colors ${
                      isActive ? 'text-brown font-medium' : 'text-muted-brown group-hover:text-brown'
                    }`}
                  >
                    {opt.label}
                  </span>
                </label>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export function FilterSidebar({
  activeFilters,
  onFilterChange,
  onClearAll,
  searchQuery,
  onSearchChange,
}: FilterSidebarProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    () => {
      const initial: Record<string, boolean> = {};
      filterGroups.forEach((g) => {
        initial[g.id] = true;
      });
      return initial;
    }
  );

  const totalActiveFilters = Object.values(activeFilters).reduce(
    (sum, arr) => sum + arr.length,
    0
  );

  return (
    <aside className="w-full lg:w-[280px] xl:w-[300px] shrink-0">
      <div className="sticky top-[88px] bg-ivory border border-border/50 rounded-lg p-5 max-h-[calc(100dvh-100px)] overflow-y-auto">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-brown" />
          <input
            type="text"
            placeholder="Search jewellery..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm font-body bg-cream border border-border rounded text-brown placeholder:text-sand focus:border-clay focus:outline-none transition-colors"
          />
        </div>

        {/* Filter Sections */}
        {filterGroups.map((group) => (
          <FilterSection
            key={group.id}
            group={group}
            activeValues={activeFilters[group.id] || []}
            onToggle={(value) => onFilterChange(group.id, value)}
            isOpen={openSections[group.id] ?? true}
            onToggleSection={() =>
              setOpenSections((prev) => ({
                ...prev,
                [group.id]: !prev[group.id],
              }))
            }
          />
        ))}

        {/* Actions */}
        <div className="flex gap-3 mt-5 pt-4 border-t border-border/40">
          <button className="flex-1 py-2.5 text-[11px] font-body font-semibold uppercase tracking-[0.12em] bg-clay text-white rounded hover:bg-burnt-gold transition-colors shadow-sm">
            Apply Filters
          </button>
          {totalActiveFilters > 0 && (
            <button
              onClick={onClearAll}
              className="flex-1 py-2.5 text-[11px] font-body font-semibold uppercase tracking-[0.12em] border border-border text-muted-brown rounded hover:text-clay hover:border-clay/50 transition-all font-bold"
            >
              Clear All
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
