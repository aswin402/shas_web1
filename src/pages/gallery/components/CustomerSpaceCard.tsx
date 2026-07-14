import type { CustomerSpace } from '@/types';
import { MapPin } from 'lucide-react';

interface CustomerSpaceCardProps {
  space: CustomerSpace;
}

export function CustomerSpaceCard({ space }: CustomerSpaceCardProps) {
  return (
    <div className="bg-cream border border-border/50 rounded-lg overflow-hidden group reveal">
      <div className="aspect-square overflow-hidden bg-warm-beige/20">
        <img 
          src={space.image} 
          alt={`Styled by ${space.customerName}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-heading text-lg text-brown font-semibold">{space.customerName}</h4>
          <div className="flex items-center gap-1 text-xs text-temple-red font-medium">
            <MapPin className="w-3 h-3" />
            {space.location}
          </div>
        </div>
        <p className="text-sm text-muted-brown font-body">
          {space.productName}
        </p>
      </div>
    </div>
  );
}
