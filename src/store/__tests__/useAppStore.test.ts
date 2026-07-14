import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAppStore } from '../useAppStore';
import { supabase } from '../../lib/supabase';

// Mock Supabase client
const mockGetSession = vi.fn();

vi.mock('../../lib/supabase', () => {
  const queryBuilder = {
    select: vi.fn(),
    upsert: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    match: vi.fn(),
  };
  queryBuilder.select.mockReturnValue(queryBuilder);
  queryBuilder.upsert.mockReturnValue(queryBuilder);
  queryBuilder.insert.mockReturnValue(queryBuilder);
  queryBuilder.update.mockReturnValue(queryBuilder);
  queryBuilder.delete.mockReturnValue(queryBuilder);
  queryBuilder.match.mockReturnValue(queryBuilder);

  return {
    supabase: {
      auth: {
        getSession: () => mockGetSession(),
      },
      from: vi.fn().mockReturnValue(queryBuilder),
    },
  };
});

// Helper for mocked supabase client methods
const queryBuilderMock = supabase.from('dummy') as unknown as {
  select: ReturnType<typeof vi.fn>;
  upsert: ReturnType<typeof vi.fn>;
  insert: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
  match: ReturnType<typeof vi.fn>;
};

describe('useAppStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset Zustand store state
    useAppStore.setState({
      user: null,
      isLoading: false,
      cart: [],
      wishlist: [],
    });
    // Default supabase session to null
    mockGetSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });
  });

  describe('User Authentication Actions', () => {
    it('should set user and clear local state when logging out', async () => {
      useAppStore.setState({
        user: { id: 'user-123', name: 'John Doe', email: 'john@example.com' },
        cart: [{ productId: 'p1', quantity: 2 }],
        wishlist: ['p2'],
      });

      await useAppStore.getState().setUser(null);

      const state = useAppStore.getState();
      expect(state.user).toBeNull();
      expect(state.cart).toEqual([]);
      expect(state.wishlist).toEqual([]);
    });

    it('should set user and merge guest state when logging in', async () => {
      // Mock session for logged-in user
      mockGetSession.mockResolvedValue({
        data: {
          session: {
            user: { id: 'user-123' },
          },
        },
      });

      queryBuilderMock.select.mockResolvedValueOnce({ data: [], error: null }); // mergeGuestState remote cart check
      queryBuilderMock.select.mockResolvedValueOnce({ data: [], error: null }); // fetchCart
      queryBuilderMock.select.mockResolvedValueOnce({ data: [], error: null }); // fetchWishlist

      useAppStore.setState({
        cart: [{ productId: 'p1', quantity: 2 }],
        wishlist: ['p2'],
      });

      await useAppStore.getState().setUser({ id: 'user-123', name: 'John Doe', email: 'john@example.com' });

      const state = useAppStore.getState();
      expect(state.user).toEqual({ id: 'user-123', name: 'John Doe', email: 'john@example.com' });

      // Verifying mergeGuestState upserts
      expect(supabase.from).toHaveBeenCalledWith('cart_items');
      expect(queryBuilderMock.upsert).toHaveBeenCalledWith([
        {
          user_id: 'user-123',
          product_id: 'p1',
          quantity: 2,
        }
      ], { onConflict: 'user_id,product_id' });

      expect(supabase.from).toHaveBeenCalledWith('wishlist_items');
      expect(queryBuilderMock.upsert).toHaveBeenCalledWith([
        {
          user_id: 'user-123',
          product_id: 'p2',
        }
      ], { onConflict: 'user_id,product_id' });
    });
  });

  describe('Cart Actions', () => {
    it('should add item to cart (guest)', async () => {
      await useAppStore.getState().addToCart('p1', 2);
      expect(useAppStore.getState().cart).toEqual([{ productId: 'p1', quantity: 2 }]);
      expect(supabase.from).not.toHaveBeenCalled();
    });

    it('should add item to cart and sync with Supabase (authenticated)', async () => {
      mockGetSession.mockResolvedValue({
        data: {
          session: {
            user: { id: 'user-123' },
          },
        },
      });

      await useAppStore.getState().addToCart('p1', 2);
      
      expect(useAppStore.getState().cart).toEqual([{ productId: 'p1', quantity: 2 }]);
      expect(supabase.from).toHaveBeenCalledWith('cart_items');
      expect(queryBuilderMock.upsert).toHaveBeenCalledWith({
        user_id: 'user-123',
        product_id: 'p1',
        quantity: 2,
      }, { onConflict: 'user_id,product_id' });
    });

    it('should increment quantity if item already exists in cart', async () => {
      mockGetSession.mockResolvedValue({
        data: {
          session: {
            user: { id: 'user-123' },
          },
        },
      });

      useAppStore.setState({
        cart: [{ productId: 'p1', quantity: 2 }],
      });

      await useAppStore.getState().addToCart('p1', 3);

      expect(useAppStore.getState().cart).toEqual([{ productId: 'p1', quantity: 5 }]);
      expect(queryBuilderMock.upsert).toHaveBeenCalledWith({
        user_id: 'user-123',
        product_id: 'p1',
        quantity: 5,
      }, { onConflict: 'user_id,product_id' });
    });

    it('should update cart item quantity and sync with Supabase', async () => {
      mockGetSession.mockResolvedValue({
        data: {
          session: {
            user: { id: 'user-123' },
          },
        },
      });

      useAppStore.setState({
        cart: [{ productId: 'p1', quantity: 2 }],
      });

      await useAppStore.getState().updateCartQuantity('p1', 4);

      expect(useAppStore.getState().cart).toEqual([{ productId: 'p1', quantity: 4 }]);
      expect(queryBuilderMock.update).toHaveBeenCalledWith({ quantity: 4 });
      expect(queryBuilderMock.match).toHaveBeenCalledWith({ user_id: 'user-123', product_id: 'p1' });
    });

    it('should remove item from cart and sync with Supabase', async () => {
      mockGetSession.mockResolvedValue({
        data: {
          session: {
            user: { id: 'user-123' },
          },
        },
      });

      useAppStore.setState({
        cart: [{ productId: 'p1', quantity: 2 }, { productId: 'p2', quantity: 1 }],
      });

      await useAppStore.getState().removeFromCart('p1');

      expect(useAppStore.getState().cart).toEqual([{ productId: 'p2', quantity: 1 }]);
      expect(queryBuilderMock.delete).toHaveBeenCalled();
      expect(queryBuilderMock.match).toHaveBeenCalledWith({ user_id: 'user-123', product_id: 'p1' });
    });

    it('should fetch cart from Supabase', async () => {
      mockGetSession.mockResolvedValue({
        data: {
          session: {
            user: { id: 'user-123' },
          },
        },
      });

      queryBuilderMock.select.mockResolvedValueOnce({
        data: [
          { product_id: 'p1', quantity: 3 },
          { product_id: 'p2', quantity: 1 },
        ],
        error: null,
      });

      await useAppStore.getState().fetchCart();

      expect(supabase.from).toHaveBeenCalledWith('cart_items');
      expect(queryBuilderMock.select).toHaveBeenCalledWith('product_id, quantity');
      expect(useAppStore.getState().cart).toEqual([
        { productId: 'p1', quantity: 3 },
        { productId: 'p2', quantity: 1 },
      ]);
    });
  });

  describe('Wishlist Actions', () => {
    it('should toggle wishlist item (guest)', async () => {
      // Add
      await useAppStore.getState().toggleWishlist('p1');
      expect(useAppStore.getState().wishlist).toEqual(['p1']);

      // Remove
      await useAppStore.getState().toggleWishlist('p1');
      expect(useAppStore.getState().wishlist).toEqual([]);

      expect(supabase.from).not.toHaveBeenCalled();
    });

    it('should add wishlist item and sync with Supabase (authenticated)', async () => {
      mockGetSession.mockResolvedValue({
        data: {
          session: {
            user: { id: 'user-123' },
          },
        },
      });

      await useAppStore.getState().toggleWishlist('p1');

      expect(useAppStore.getState().wishlist).toEqual(['p1']);
      expect(supabase.from).toHaveBeenCalledWith('wishlist_items');
      expect(queryBuilderMock.insert).toHaveBeenCalledWith({
        user_id: 'user-123',
        product_id: 'p1',
      });
    });

    it('should remove wishlist item and sync with Supabase (authenticated)', async () => {
      mockGetSession.mockResolvedValue({
        data: {
          session: {
            user: { id: 'user-123' },
          },
        },
      });

      useAppStore.setState({
        wishlist: ['p1', 'p2'],
      });

      await useAppStore.getState().toggleWishlist('p1');

      expect(useAppStore.getState().wishlist).toEqual(['p2']);
      expect(supabase.from).toHaveBeenCalledWith('wishlist_items');
      expect(queryBuilderMock.delete).toHaveBeenCalled();
      expect(queryBuilderMock.match).toHaveBeenCalledWith({
        user_id: 'user-123',
        product_id: 'p1',
      });
    });

    it('should fetch wishlist from Supabase', async () => {
      mockGetSession.mockResolvedValue({
        data: {
          session: {
            user: { id: 'user-123' },
          },
        },
      });

      queryBuilderMock.select.mockResolvedValueOnce({
        data: [
          { product_id: 'p1' },
          { product_id: 'p3' },
        ],
        error: null,
      });

      await useAppStore.getState().fetchWishlist();

      expect(supabase.from).toHaveBeenCalledWith('wishlist_items');
      expect(queryBuilderMock.select).toHaveBeenCalledWith('product_id');
      expect(useAppStore.getState().wishlist).toEqual(['p1', 'p3']);
    });
  });
});
