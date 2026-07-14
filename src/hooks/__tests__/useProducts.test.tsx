// @vitest-environment happy-dom
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useProductsQuery, useProductDetailQuery } from '../useProducts';
import { supabase } from '../../lib/supabase';

// Mock Supabase client
let mockSelectResult = { data: [] as any[], error: null as any };
let mockSingleResult = { data: null as any, error: null as any };

const mockQuery = {
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  single: vi.fn().mockImplementation(() => {
    return Promise.resolve(mockSingleResult);
  }),
  then: vi.fn().mockImplementation((onfulfilled) => {
    return Promise.resolve(mockSelectResult).then(onfulfilled);
  }),
};

vi.mock('../../lib/supabase', () => {
  return {
    supabase: {
      from: vi.fn(() => mockQuery),
    },
  };
});

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useProducts React Query Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSelectResult = { data: [], error: null };
    mockSingleResult = { data: null, error: null };
  });

  describe('useProductsQuery', () => {
    it('fetches all products successfully', async () => {
      const mockProducts = [
        { id: '1', name: 'Statue 1', category: 'Temple' },
        { id: '2', name: 'Statue 2', category: 'Home' },
      ];
      mockSelectResult = { data: mockProducts, error: null };

      const { result } = renderHook(() => useProductsQuery(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(supabase.from).toHaveBeenCalledWith('products');
      expect(mockQuery.select).toHaveBeenCalledWith('*');
      expect(result.current.data).toEqual(mockProducts);
    });

    it('filters products by category when provided', async () => {
      const mockProducts = [{ id: '1', name: 'Statue 1', category: 'Temple' }];
      mockSelectResult = { data: mockProducts, error: null };

      const { result } = renderHook(() => useProductsQuery('Temple'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockQuery.eq).toHaveBeenCalledWith('category', 'Temple');
      expect(result.current.data).toEqual(mockProducts);
    });

    it('handles query error correctly', async () => {
      const dbError = new Error('Database connection failed');
      mockSelectResult = { data: [], error: dbError };

      const { result } = renderHook(() => useProductsQuery(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.error).toEqual(dbError);
    });
  });

  describe('useProductDetailQuery', () => {
    it('fetches a single product details successfully', async () => {
      const mockProduct = { id: '1', name: 'Statue 1', category: 'Temple' };
      mockSingleResult = { data: mockProduct, error: null };

      const { result } = renderHook(() => useProductDetailQuery('1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(supabase.from).toHaveBeenCalledWith('products');
      expect(mockQuery.select).toHaveBeenCalledWith('*');
      expect(mockQuery.eq).toHaveBeenCalledWith('id', '1');
      expect(mockQuery.single).toHaveBeenCalled();
      expect(result.current.data).toEqual(mockProduct);
    });

    it('handles product detail query error correctly', async () => {
      const dbError = new Error('Product not found');
      mockSingleResult = { data: null, error: dbError };

      const { result } = renderHook(() => useProductDetailQuery('1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.error).toEqual(dbError);
    });
  });
});
