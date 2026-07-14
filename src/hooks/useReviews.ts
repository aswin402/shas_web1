import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export interface DbReview {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  profiles?: {
    full_name: string | null;
    username: string;
  };
}

export function useProductReviewsQuery(productId: string) {
  return useQuery<DbReview[]>({
    queryKey: ['reviews', productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_reviews')
        .select(`
          *,
          profiles (
            full_name,
            username
          )
        `)
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as unknown as DbReview[];
    },
    enabled: !!productId,
  });
}

export function useAddReviewMutation(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ rating, comment }: { rating: number; comment: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('You must be logged in to leave a review.');

      const { data, error } = await supabase
        .from('product_reviews')
        .insert({
          user_id: user.id,
          product_id: productId,
          rating,
          comment: comment.trim() || null
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          throw new Error('You have already reviewed this product.');
        }
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      // Invalidate both reviews list and product details so average rating updates
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
