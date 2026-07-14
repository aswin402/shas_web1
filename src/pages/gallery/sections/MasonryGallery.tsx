import type { GalleryItem } from '@/types';
import { GalleryCard } from '../components/GalleryCard';

interface MasonryGalleryProps {
  items: GalleryItem[];
  onItemClick: (item: GalleryItem) => void;
}

export function MasonryGallery({ items, onItemClick }: MasonryGalleryProps) {
  // Simple CSS masonry approach using columns
  return (
    <section id="gallery-grid" className="bg-cream py-20 section-padding min-h-screen">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-16 reveal">
          <h2 className="text-3xl md:text-4xl font-heading text-deep-brown mb-4">Gallery</h2>
          <p className="text-muted-brown max-w-2xl mx-auto">
            Explore statue styling ideas for every space.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-brown text-lg">No items found for this category.</p>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {items.map((item, index) => (
              <div key={item.id} className="break-inside-avoid" style={{ animationDelay: `${(index % 6) * 100}ms` }}>
                <GalleryCard item={item} onClick={onItemClick} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
