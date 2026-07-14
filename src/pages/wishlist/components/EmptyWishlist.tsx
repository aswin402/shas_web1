import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export function EmptyWishlist() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4 animate-fade-up">
      <div className="w-24 h-24 bg-warm-beige rounded-full flex items-center justify-center mb-6">
        <Heart className="w-10 h-10 text-temple-red" />
      </div>
      <h2 className="text-2xl md:text-3xl font-heading font-semibold text-deep-brown mb-3">
        Your Wishlist is Empty
      </h2>
      <p className="text-muted-brown font-body max-w-md mx-auto mb-8">
        Save your favorite divine art pieces and spiritual decor here to find them easily later.
      </p>
      <Link 
        to="/shop" 
        className="px-8 py-3 bg-temple-red text-cream font-body font-semibold uppercase tracking-widest text-xs rounded hover:bg-deep-red transition-colors"
      >
        Explore Collection
      </Link>
    </div>
  );
}
