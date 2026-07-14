import type { GalleryItem } from '@/types';

interface GalleryCardProps {
  item: GalleryItem;
  onClick: (item: GalleryItem) => void;
}

export function GalleryCard({ item, onClick }: GalleryCardProps) {
  return (
    <div 
      className="group cursor-pointer rounded-xl overflow-hidden bg-ivory border border-border/50 transition-all duration-300 hover:shadow-lg hover:border-temple-red/30 mb-6 reveal"
      onClick={() => onClick(item)}
    >
      <div className="relative overflow-hidden aspect-[4/5] bg-warm-beige/20">
        <img
          src={item.image}
          alt={item.caption}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-deep-brown/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <span className="inline-block px-3 py-1 bg-temple-red text-cream text-[10px] uppercase tracking-wider font-semibold rounded-full mb-3">
              {item.category}
            </span>
            <h3 className="text-cream font-heading text-xl mb-1">{item.title}</h3>
            <p className="text-cream/80 font-body text-sm mb-4 line-clamp-2">{item.caption}</p>
            <span className="inline-flex items-center text-sm text-cream border-b border-cream/30 pb-0.5 group-hover:border-cream transition-colors">
              Shop Similar
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
