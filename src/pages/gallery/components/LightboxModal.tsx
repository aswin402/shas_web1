import { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import type { GalleryItem } from '@/types';
import { Link } from 'react-router-dom';

interface LightboxModalProps {
  item: GalleryItem | null;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export function LightboxModal({ item, onClose, onNext, onPrev }: LightboxModalProps) {
  useEffect(() => {
    if (item) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [item]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-deep-brown/90 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-12 h-full py-12 md:py-20 flex flex-col items-center justify-center pointer-events-none">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 md:top-8 md:right-8 w-12 h-12 flex items-center justify-center rounded-full bg-cream/10 text-cream hover:bg-temple-red hover:text-cream transition-colors pointer-events-auto z-20"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Navigation Arrows */}
        <button 
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-cream/10 text-cream hover:bg-temple-red hover:text-cream transition-colors pointer-events-auto"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button 
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-cream/10 text-cream hover:bg-temple-red hover:text-cream transition-colors pointer-events-auto"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Image Container */}
        <div className="relative w-full max-h-[70vh] flex items-center justify-center pointer-events-auto" onClick={(e) => e.stopPropagation()}>
          <img 
            src={item.image} 
            alt={item.caption} 
            className="max-w-full max-h-[70vh] object-contain rounded-sm shadow-2xl"
          />
        </div>

        {/* Details Container */}
        <div className="mt-8 text-center pointer-events-auto bg-deep-brown/80 p-6 rounded-xl border border-border/20 backdrop-blur-md max-w-2xl w-full">
          <span className="inline-block px-3 py-1 bg-temple-red/20 text-temple-red text-[10px] uppercase tracking-widest font-semibold rounded-full mb-3 border border-temple-red/30">
            {item.category}
          </span>
          <h2 className="text-2xl md:text-3xl font-heading text-cream mb-2">{item.title}</h2>
          <p className="text-cream/70 font-body text-sm md:text-base mb-6">{item.caption}</p>
          
          <Link 
            to={item.link || '/shop'} 
            className="inline-flex items-center gap-2 px-6 py-3 bg-temple-red text-cream rounded-full hover:bg-deep-red transition-colors text-sm uppercase tracking-wider font-medium"
            onClick={onClose}
          >
            <ShoppingBag className="w-4 h-4" />
            Shop Similar Statue
          </Link>
        </div>

      </div>
    </div>
  );
}
