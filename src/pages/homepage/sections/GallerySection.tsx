import { SectionHeading } from '@/components/ui/SectionHeading';
import { galleryItems } from '@/data/navigation';
import { ArrowRight } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { LazyImage } from '@/components/ui/LazyImage';

export function GallerySection() {
  const { ref, isVisible } = useScrollAnimation();

  // Bento grid: 2 rows, 12 columns
  // Row 1: [img1 ─ 3cols] [img2 ─ 3cols] [img3 ──── 6cols ────]
  // Row 2: [img4 ──── 6cols ────] [img5 ──── 6cols ────]
  const gridPositions = [
    'col-span-1 md:col-start-1 md:col-end-4 md:row-start-1 md:row-end-2',   // Top left
    'col-span-1 md:col-start-4 md:col-end-7 md:row-start-1 md:row-end-2',   // Top middle
    'col-span-2 md:col-start-7 md:col-end-13 md:row-start-1 md:row-end-2',  // Top right (wide)
    'col-span-1 md:col-start-1 md:col-end-7 md:row-start-2 md:row-end-3',   // Bottom left (wide)
    'col-span-1 md:col-start-7 md:col-end-13 md:row-start-2 md:row-end-3',  // Bottom right (wide)
  ];

  return (
    <section className="section-spacing bg-warm-beige/40">
      <div className="max-w-[1400px] mx-auto section-padding">
        <SectionHeading
          eyebrow="Lookbook"
          title="Our Styling Lookbook"
          subtitle="Discover how our heritage ornaments bring timeless elegance to every attire and occasion."
        />
        <div
          ref={ref}
          className={`grid grid-cols-2 md:grid-cols-12 md:grid-rows-[250px_250px] gap-3 md:gap-4 auto-rows-[180px] sm:auto-rows-[220px] transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {galleryItems.map((item, i) => (
            <div
              key={item.id}
              className={`group relative overflow-hidden rounded-lg ${gridPositions[i]} bg-sand`}
            >
              <LazyImage src={item.image} alt={item.caption} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-luxury/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                {item.tag && (
                  <span className="inline-block px-2 py-0.5 text-[9px] font-body font-semibold uppercase tracking-[0.1em] bg-clay/90 text-white rounded-sm mb-1.5 font-bold">
                    {item.tag}
                  </span>
                )}
                <p className="text-sm font-heading font-semibold text-cream">{item.caption}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10 md:mt-12">
          <a href="/gallery" className="inline-flex items-center gap-2 text-sm font-body font-semibold uppercase tracking-[0.1em] text-clay hover:text-burnt-gold transition-colors group font-bold">
            View Gallery
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
}
