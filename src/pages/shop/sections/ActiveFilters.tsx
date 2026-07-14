import { X } from 'lucide-react';
import { filterGroups } from '@/data/shopData';

interface ActiveFiltersProps {
  activeFilters: Record<string, string[]>;
  onRemoveFilter: (groupId: string, value: string) => void;
  onClearAll: () => void;
}

export function ActiveFilters({
  activeFilters,
  onRemoveFilter,
  onClearAll,
}: ActiveFiltersProps) {
  const chips: { groupId: string; label: string; value: string }[] = [];

  Object.entries(activeFilters).forEach(([groupId, values]) => {
    const group = filterGroups.find((g) => g.id === groupId);
    if (!group) return;
    values.forEach((value) => {
      const option = group.options.find((o) => o.value === value);
      if (option) {
        chips.push({ groupId, label: option.label, value });
      }
    });
  });

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 py-3">
      {chips.map((chip) => (
        <button
          key={`${chip.groupId}-${chip.value}`}
          onClick={() => onRemoveFilter(chip.groupId, chip.value)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-warm-beige/60 border border-border/40 rounded-full text-xs font-body text-brown hover:border-temple-red/40 transition-all group"
        >
          {chip.label}
          <X className="w-3 h-3 text-muted-brown group-hover:text-temple-red transition-colors" />
        </button>
      ))}
      <button
        onClick={onClearAll}
        className="text-xs font-body font-medium text-temple-red hover:text-deep-red transition-colors ml-1"
      >
        Clear All
      </button>
    </div>
  );
}
