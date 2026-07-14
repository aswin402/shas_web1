import { ArrowRight } from 'lucide-react';
import type { Collection } from '@/types';

interface CollectionCardProps {
  collection: Collection;
}

export function CollectionCard({ collection }: CollectionCardProps) {
  return (
    <a
      href="/shop"
      className="group block relative overflow-hidden rounded-lg border border-border bg-ivory transition-all duration-300 hover:shadow-[0_4px_24px_oklch(0.78_0.045_75/0.3)]"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={collection.image}
          alt={collection.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-luxury/70 via-dark-luxury/20 to-transparent" />

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="font-heading text-xl md:text-2xl font-semibold text-cream mb-1">
            {collection.title}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pt-3">
        <p className="text-sm text-muted-brown leading-relaxed mb-3 line-clamp-2">
          {collection.description}
        </p>
        <span className="inline-flex items-center gap-1.5 text-xs font-body font-semibold uppercase tracking-[0.12em] text-temple-red transition-all duration-200 group-hover:gap-2.5">
          Explore
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
        </span>
      </div>
    </a>
  );
}
