import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import { useToastStore } from './useToastStore';

interface CartItem {
  id?: string;
  productId: string;
  quantity: number;
}

interface AppUser {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  username?: string | null;
  is_admin?: boolean;
}

interface AppState {
  user: AppUser | null;
  setUser: (user: AppUser | null) => Promise<void>;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  cart: CartItem[];
  wishlist: string[]; // array of productIds
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateCartQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
  fetchCart: () => Promise<void>;
  fetchWishlist: () => Promise<void>;
  clearLocalState: () => void;
  mergeGuestState: () => Promise<void>;
}

const getUserId = async (get: () => AppState) => {
  const stateUser = get().user;
  if (stateUser?.id) return stateUser.id;
  const session = await supabase.auth.getSession();
  return session.data.session?.user?.id;
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: async (user) => {
        const prevUser = get().user;
        if (prevUser?.id === user?.id) {
          if (user) {
            // Same user already loaded, just keep local cart in sync with DB
            await get().fetchCart();
            await get().fetchWishlist();
          }
          return;
        }

        set({ user });
        if (user) {
          await get().mergeGuestState();
        } else {
          get().clearLocalState();
        }
      },
      isLoading: false,
      setIsLoading: (isLoading) => set({ isLoading }),
      cart: [],
      wishlist: [],
      
      fetchCart: async () => {
        const userId = await getUserId(get);
        if (!userId) return;
        const { data, error } = await supabase
          .from('cart_items')
          .select('product_id, quantity');
        if (error) {
          console.error('Error fetching cart:', error.message);
          return;
        }
        set({ cart: data.map(item => ({ productId: item.product_id, quantity: item.quantity })) });
      },

      fetchWishlist: async () => {
        const userId = await getUserId(get);
        if (!userId) return;
        const { data, error } = await supabase
          .from('wishlist_items')
          .select('product_id');
        if (error) {
          console.error('Error fetching wishlist:', error.message);
          return;
        }
        set({ wishlist: data.map(item => item.product_id) });
      },

      addToCart: async (productId, quantity = 1) => {
        const currentCart = get().cart;
        const existing = currentCart.find(item => item.productId === productId);
        let newCart = [...currentCart];

        if (existing) {
          newCart = currentCart.map(item => 
            item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item
          );
        } else {
          newCart.push({ productId, quantity });
        }

        set({ cart: newCart });
        useToastStore.getState().addToast('Item added to cart.', 'success');

        const userId = await getUserId(get);
        if (userId) {
          const { error } = await supabase.from('cart_items').upsert({
            user_id: userId,
            product_id: productId,
            quantity: existing ? existing.quantity + quantity : quantity,
          }, { onConflict: 'user_id,product_id' });
          if (error) {
            console.error('Error syncing cart addition:', error.message);
          }
        }
      },

      updateCartQuantity: async (productId, quantity) => {
        const newCart = get().cart.map(item => 
          item.productId === productId ? { ...item, quantity } : item
        );
        set({ cart: newCart });

        const userId = await getUserId(get);
        if (userId) {
          const { error } = await supabase.from('cart_items').update({ quantity }).match({ user_id: userId, product_id: productId });
          if (error) {
            console.error('Error syncing cart update:', error.message);
          }
        }
      },

      removeFromCart: async (productId) => {
        set({ cart: get().cart.filter(item => item.productId !== productId) });
        useToastStore.getState().addToast('Item removed from cart.', 'success');

        const userId = await getUserId(get);
        if (userId) {
          const { error } = await supabase.from('cart_items').delete().match({ user_id: userId, product_id: productId });
          if (error) {
            console.error('Error syncing cart removal:', error.message);
          }
        }
      },

      toggleWishlist: async (productId) => {
        const currentList = get().wishlist;
        const hasIt = currentList.includes(productId);
        const newList = hasIt ? currentList.filter(id => id !== productId) : [...currentList, productId];
        set({ wishlist: newList });
        
        if (hasIt) {
          useToastStore.getState().addToast('Item removed from wishlist.', 'info');
        } else {
          useToastStore.getState().addToast('Item added to wishlist.', 'success');
        }

        const userId = await getUserId(get);
        if (userId) {
          let error;
          if (hasIt) {
            const res = await supabase.from('wishlist_items').delete().match({ user_id: userId, product_id: productId });
            error = res.error;
          } else {
            const res = await supabase.from('wishlist_items').insert({ user_id: userId, product_id: productId });
            error = res.error;
          }
          if (error) {
            console.error('Error syncing wishlist toggle:', error.message);
          }
        }
      },

      clearLocalState: () => set({ cart: [], wishlist: [] }),

      mergeGuestState: async () => {
        const userId = await getUserId(get);
        if (!userId) return;

        const localCart = get().cart;
        const localWishlist = get().wishlist;

        if (localCart.length > 0) {
          // Fetch remote cart to perform a summation merge
          const { data: remoteCart, error: fetchErr } = await supabase
            .from('cart_items')
            .select('product_id, quantity');

          if (!fetchErr && remoteCart) {
            const remoteMap = new Map<string, number>(
              remoteCart.map(item => [item.product_id, item.quantity])
            );

            const mergedCartRows = localCart.map(item => {
              const remoteQty = remoteMap.get(item.productId) || 0;
              return {
                user_id: userId,
                product_id: item.productId,
                quantity: item.quantity + remoteQty,
              };
            });

            const { error } = await supabase.from('cart_items').upsert(mergedCartRows, { onConflict: 'user_id,product_id' });
            if (error) {
              console.error('Error merging guest cart:', error.message);
            }
          } else {
            const cartRows = localCart.map(item => ({
              user_id: userId,
              product_id: item.productId,
              quantity: item.quantity,
            }));
            const { error } = await supabase.from('cart_items').upsert(cartRows, { onConflict: 'user_id,product_id' });
            if (error) {
              console.error('Error merging guest cart:', error.message);
            }
          }
        }

        if (localWishlist.length > 0) {
          const wishlistRows = localWishlist.map(pid => ({
            user_id: userId,
            product_id: pid,
          }));
          const { error } = await supabase.from('wishlist_items').upsert(wishlistRows, { onConflict: 'user_id,product_id' });
          if (error) {
            console.error('Error merging guest wishlist:', error.message);
          }
        }

        await get().fetchCart();
        await get().fetchWishlist();
      },
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({ user: state.user, cart: state.cart, wishlist: state.wishlist }),
    }
  )
);
