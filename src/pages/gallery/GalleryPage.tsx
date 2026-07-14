import { useState, useEffect } from 'react';
import { GalleryHero } from './sections/GalleryHero';
import { CategoryFilters } from './sections/CategoryFilters';
import { FeaturedLookbookGrid } from './sections/FeaturedLookbookGrid';
import { MasonryGallery } from './sections/MasonryGallery';
import { StylingGuideSection } from './sections/StylingGuideSection';
import { BeforeAfterSection } from './sections/BeforeAfterSection';
import { CustomGalleryCTA } from './sections/CustomGalleryCTA';
import { CustomerSpacesSection } from './sections/CustomerSpacesSection';
import { SocialCTASection } from './sections/SocialCTASection';
import { LightboxModal } from './components/LightboxModal';
import { TrustStrip } from '@/components/common/TrustStrip';

import { 
  galleryCategories, 
  featuredSpaces, 
  galleryItems, 
  stylingGuides, 
  customerSpaces 
} from '@/data/galleryData';

import type { GalleryItem } from '@/types';

export function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  // Filter items based on active category
  const filteredItems = activeCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeCategory);

  // Scroll Reveal Logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // observer.unobserve(entry.target); // Optional: stop observing once visible
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [filteredItems]); // Re-run when filtered items change

  // Lightbox Navigation Logic
  const handleNext = () => {
    if (!selectedItem) return;
    const currentIndex = filteredItems.findIndex(item => item.id === selectedItem.id);
    const nextIndex = (currentIndex + 1) % filteredItems.length;
    setSelectedItem(filteredItems[nextIndex]);
  };

  const handlePrev = () => {
    if (!selectedItem) return;
    const currentIndex = filteredItems.findIndex(item => item.id === selectedItem.id);
    const prevIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    setSelectedItem(filteredItems[prevIndex]);
  };

  return (
    <main className="min-h-screen bg-cream">
      <GalleryHero />
      
      <CategoryFilters 
        categories={galleryCategories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      
      <FeaturedLookbookGrid spaces={featuredSpaces} />
      
      <MasonryGallery 
        items={filteredItems} 
        onItemClick={setSelectedItem} 
      />
      
      <StylingGuideSection guides={stylingGuides} />
      
      <BeforeAfterSection />
      
      <CustomGalleryCTA />
      
      <CustomerSpacesSection spaces={customerSpaces} />
      
      <SocialCTASection />
      
      <TrustStrip />

      <LightboxModal 
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </main>
  );
}
