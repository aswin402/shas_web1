import type { GalleryCategory } from '@/types';

interface CategoryFiltersProps {
  categories: GalleryCategory[];
  activeCategory: string;
  onCategoryChange: (categoryValue: string) => void;
}

export function CategoryFilters({ categories, activeCategory, onCategoryChange }: CategoryFiltersProps) {
  return (
    <div className="w-full border-b border-border/30 bg-cream sticky top-[64px] md:top-[72px] z-30">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 lg:px-16 xl:px-20 py-4">
        <div className="flex items-center gap-6 md:gap-8">
          <span className="text-sm font-heading font-semibold text-brown whitespace-nowrap hidden md:block">
            Browse by Space
          </span>
          <div className="flex-1 overflow-x-auto no-scrollbar mask-edges">
            <div className="flex items-center gap-3 pb-1 w-max">
              {categories.map((category) => {
                const isActive = activeCategory === category.value;
                return (
                  <button
                    key={category.id}
                    onClick={() => onCategoryChange(category.value)}
                    className={`
                      px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap
                      ${isActive 
                        ? 'bg-temple-red text-cream shadow-md' 
                        : 'bg-transparent text-muted-brown border border-border/60 hover:border-brown hover:text-brown'
                      }
                    `}
                  >
                    {category.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @media (max-width: 768px) {
          .mask-edges {
            mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
            -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
          }
        }
      `}</style>
    </div>
  );
}
