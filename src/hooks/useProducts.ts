import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { ShopProduct } from '../types';
import { shopProducts, getDriveImageUrl } from '../data/shopData';

function mapShopProductToDb(p: ShopProduct) {
  return {
    id: p.id,
    name: p.name,
    description: '',
    price: p.price,
    image_url: p.image,
    category: p.category,
    stock: p.inStock ? 10 : 0,
    rating: p.rating,
    reviews_count: p.reviewCount,
    details: {
      dimensions: p.size || '',
      material: p.material || '',
      usage: p.usage || 'Living Room',
      colorFinish: p.colorFinish || 'Natural',
    },
    is_featured: false,
  };
}

export function useProductsQuery(category?: string) {
  return useQuery({
    queryKey: ['products', category],
    queryFn: async () => {
      const isConfigured = !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
      
      if (isConfigured) {
        try {
          let query = supabase.from('products').select('*');
          if (category && category !== 'All') {
            query = query.eq('category', category);
          }
          
          // Race query against a 3.5s timeout to handle Supabase cold starts seamlessly
          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Database query timed out (likely cold start)')), 3500)
          );
          
          const { data, error } = await Promise.race([query, timeoutPromise]);
          if (error) throw error;
          if (data) {
            return data.map(p => {
              if (p.image_url === undefined) return p;
              return {
                ...p,
                image_url: getDriveImageUrl(p.image_url),
              };
            });
          }
        } catch (dbError: any) {
          if (dbError?.message?.includes('timed out')) {
            console.warn('Supabase products fetch timed out, falling back to local data:', dbError);
          } else {
            throw dbError;
          }
        }
      }

      return shopProducts.map(mapShopProductToDb);
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useProductDetailQuery(productId: string) {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      if (!productId) throw new Error('Product ID is required');

      // Fallback for mock IDs
      if (productId.startsWith('sp-')) {
        const mockProduct = shopProducts.find(p => p.id === productId);
        if (mockProduct) {
          return mapShopProductToDb(mockProduct);
        }
      }

      try {
        const query = supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();

        // Race query against a 3.5s timeout to handle Supabase cold starts seamlessly
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Database query timed out')), 3500)
        );

        const { data, error } = await Promise.race([query, timeoutPromise]);
        if (error) throw error;
        if (data) {
          if (data.image_url === undefined) return data;
          return {
            ...data,
            image_url: getDriveImageUrl(data.image_url),
          };
        }
        return data;
      } catch (e) {
        console.warn('Supabase product fetch failed, falling back to local data:', e);
        // Try shopData as final fallback
        const fallback = shopProducts.find(p => p.id === productId);
        if (fallback) return mapShopProductToDb(fallback);
        throw e;
      }
    },
    enabled: !!productId,
  });
}
