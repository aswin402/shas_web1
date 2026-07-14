import { useState } from 'react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  skeletonClassName?: string;
  containerClassName?: string;
}

export function LazyImage({
  src,
  alt,
  className = '',
  fallbackSrc = '/images/products/placeholder.webp',
  skeletonClassName = '',
  containerClassName = '',
  onLoad,
  onError,
  ...props
}: LazyImageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div className={`relative w-full h-full overflow-hidden ${containerClassName}`}>
      {loading && (
        <div className={`absolute inset-0 bg-muted-brown/10 animate-pulse z-10 ${skeletonClassName}`} />
      )}
      <img
        src={error ? fallbackSrc : src}
        alt={alt}
        className={`transition-all duration-500 ${
          loading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        } ${className}`}
        onLoad={(e) => {
          setLoading(false);
          if (onLoad) onLoad(e);
        }}
        onError={(e) => {
          setError(true);
          setLoading(false);
          if (onError) onError(e);
        }}
        {...props}
      />
    </div>
  );
}
