import { useState } from 'react';
import { useProductReviewsQuery, useAddReviewMutation } from '@/hooks/useReviews';
import { useAppStore } from '@/store/useAppStore';
import { Star, Loader2, MessageSquare, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProductReviewsSectionProps {
  productId: string;
}

export function ProductReviewsSection({ productId }: ProductReviewsSectionProps) {
  const user = useAppStore(state => state.user);
  const { data: reviews, isLoading, isError, error } = useProductReviewsQuery(productId);
  const addReviewMutation = useAddReviewMutation(productId);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);

  // Statistics calculations
  const stats = useMemo(() => {
    const list = reviews || [];
    const total = list.length;
    const avg = total > 0 ? Number((list.reduce((acc, curr) => acc + curr.rating, 0) / total).toFixed(1)) : 0;
    
    const distribution = [0, 0, 0, 0, 0]; // Index 0 represents 1-star, index 4 represents 5-stars
    list.forEach(r => {
      const idx = Math.min(4, Math.max(0, r.rating - 1));
      distribution[idx]++;
    });

    return { total, avg, distribution: distribution.reverse() }; // Return 5-star to 1-star
  }, [reviews]);

  const handleStarClick = (selected: number) => {
    setRating(selected);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(false);

    if (!user) {
      setFormError('You must be logged in to submit a review.');
      return;
    }

    try {
      await addReviewMutation.mutateAsync({ rating, comment });
      setComment('');
      setRating(5);
      setFormSuccess(true);
      setTimeout(() => setFormSuccess(false), 5000);
    } catch (err) {
      const error = err as Error;
      setFormError(error.message || 'Failed to submit review.');
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="py-12 flex flex-col items-center justify-center text-center">
        <Loader2 className="w-6 h-6 animate-spin text-temple-red" />
        <p className="text-xs text-muted-brown uppercase tracking-wider mt-2">Loading Reviews...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 bg-temple-red/10 border border-temple-red/20 rounded-lg text-deep-brown flex items-start gap-2.5 text-xs">
        <AlertCircle className="w-4 h-4 text-temple-red shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold">Review Error</h4>
          <p className="text-muted-brown mt-0.5">{(error as Error).message || 'Failed to fetch reviews.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16 text-deep-brown font-body animate-fade-up">
      {/* LEFT COLUMN: Statistics */}
      <div className="lg:col-span-1 space-y-6">
        <h3 className="text-lg font-heading font-semibold tracking-wide border-b border-border/20 pb-3">Customer Ratings</h3>
        
        <div className="flex items-center gap-4">
          <div className="text-5xl font-heading font-bold text-deep-brown">{stats.avg}</div>
          <div className="space-y-1">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star 
                  key={s} 
                  className={`w-4 h-4 ${
                    s <= Math.round(stats.avg) 
                      ? 'fill-yellow-400 text-yellow-400' 
                      : 'text-border/50 fill-border/10'
                  }`} 
                />
              ))}
            </div>
            <p className="text-xs text-muted-brown tracking-wide font-semibold">Based on {stats.total} reviews</p>
          </div>
        </div>

        {/* Rating Bars */}
        <div className="space-y-2.5">
          {stats.distribution.map((count, index) => {
            const starNum = 5 - index;
            const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
            return (
              <div key={starNum} className="flex items-center gap-3 text-xs text-muted-brown">
                <span className="w-10 font-medium flex items-center gap-1">
                  {starNum} <Star className="w-3 h-3 fill-muted-brown/30 text-muted-brown/30" />
                </span>
                <div className="flex-1 h-2 bg-cream border border-border/15 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-400 transition-all duration-500" 
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-8 text-right font-mono font-medium">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* CENTER/RIGHT COLUMN: Reviews & Form */}
      <div className="lg:col-span-2 space-y-8">
        
        {/* Review Form (Authenticated only) */}
        <div className="border border-border/30 bg-cream/15 rounded-xl p-6 space-y-4">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-brown">Write a Review</h4>
          
          {!user ? (
            <div className="text-center p-6 border border-dashed border-border/30 rounded-lg bg-cream/10 space-y-3">
              <MessageSquare className="w-8 h-8 mx-auto text-muted-brown/30 stroke-1" />
              <p className="text-xs text-muted-brown">You must be logged in to share your experience with this creation.</p>
              <Link 
                to="/account" 
                className="inline-block px-4 py-2 border border-border/30 hover:border-temple-red/45 bg-white text-xs font-semibold uppercase tracking-widest text-deep-brown hover:text-temple-red rounded transition-all duration-200"
              >
                Log In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmitReview} className="space-y-4">
              {formError && (
                <div className="p-3 bg-temple-red/10 border border-temple-red/20 rounded-md text-xs text-deep-brown font-medium">
                  {formError}
                </div>
              )}
              {formSuccess && (
                <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-md text-xs font-medium">
                  Thank you! Your review was successfully added.
                </div>
              )}

              {/* Star selector */}
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-brown block">Rating</span>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleStarClick(s)}
                      className="hover:scale-110 transition-transform focus:outline-none"
                    >
                      <Star 
                        className={`w-6 h-6 ${
                          s <= rating 
                            ? 'fill-yellow-400 text-yellow-400' 
                            : 'text-border fill-border/10'
                        }`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment Box */}
              <div className="space-y-1">
                <label htmlFor="review-comment" className="text-xs font-semibold uppercase tracking-wider text-muted-brown">
                  Comment (Optional)
                </label>
                <textarea
                  id="review-comment"
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details about materials, quality, and carvings..."
                  className="w-full bg-white border border-border/30 focus:border-temple-red/35 rounded-lg px-4 py-2.5 text-deep-brown text-sm placeholder-muted-brown/30 focus:outline-none transition-all resize-none"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={addReviewMutation.isPending}
                  className="flex items-center gap-2 px-6 py-2 bg-temple-red hover:bg-temple-red/90 text-cream font-semibold text-xs uppercase tracking-widest rounded shadow-md transition-all duration-200 disabled:opacity-50"
                >
                  {addReviewMutation.isPending && <Loader2 className="w-3 h-3 animate-spin" />}
                  Submit Review
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          <h3 className="text-lg font-heading font-semibold tracking-wide border-b border-border/20 pb-3">Reviews list</h3>
          
          {reviews?.length === 0 ? (
            <div className="text-center py-12 text-muted-brown/40 border border-dashed border-border/20 rounded-xl bg-cream/10">
              <MessageSquare className="w-10 h-10 mx-auto mb-2 text-muted-brown/25 stroke-1" />
              <p className="text-xs uppercase tracking-widest font-semibold">No reviews yet</p>
              <p className="text-[10px] mt-1">Be the first to review this handcrafted masterpiece!</p>
            </div>
          ) : (
            <div className="divide-y divide-border/25 space-y-5">
              {reviews?.map((review) => (
                <div key={review.id} className="pt-5 first:pt-0 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">
                        {review.profiles?.full_name || review.profiles?.username || 'Verified Collector'}
                      </p>
                      <p className="text-[10px] text-muted-brown font-mono mt-0.5">
                        {formatDate(review.created_at)}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star 
                          key={s} 
                          className={`w-3.5 h-3.5 ${
                            s <= review.rating 
                              ? 'fill-yellow-400 text-yellow-400' 
                              : 'text-border/40 fill-border/5'
                          }`} 
                        />
                      ))}
                    </div>
                  </div>
                  
                  {review.comment && (
                    <p className="text-sm text-brown leading-relaxed font-body whitespace-pre-wrap">
                      {review.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Simple wrapper to safely use useMemo
import { useMemo } from 'react';
export default ProductReviewsSection;
