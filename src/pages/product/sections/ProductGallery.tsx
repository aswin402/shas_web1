import { useState } from 'react';

interface ProductGalleryProps {
  image: string;
  name: string;
}

export function ProductGallery({ image, name }: ProductGalleryProps) {
  const [mainImgLoading, setMainImgLoading] = useState(true);
  const [mainImgError, setMainImgError] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="relative aspect-[4/5] md:aspect-square bg-ivory rounded-lg overflow-hidden border border-border/50 group">
        {mainImgLoading && (
          <div className="absolute inset-0 bg-muted-brown/10 animate-pulse" />
        )}
        <img
          src={mainImgError ? '/images/products/placeholder.webp' : image}
          alt={name}
          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
            mainImgLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
          referrerPolicy="no-referrer"
          onLoad={() => setMainImgLoading(false)}
          onError={() => {
            setMainImgError(true);
            setMainImgLoading(false);
          }}
        />
        {/* Optional: Add a zoom instruction overlay that fades out */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none" />
      </div>
    </div>
  );
}
