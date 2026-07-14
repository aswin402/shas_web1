// @vitest-environment happy-dom
import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { AdminProductsPage } from '../AdminProductsPage';
import { useProductsQuery } from '@/hooks/useProducts';
import { supabase } from '@/lib/supabase';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock the React Query hooks
vi.mock('@/hooks/useProducts', () => ({
  useProductsQuery: vi.fn(),
}));

// Mock Supabase client
const mockSelect = vi.fn();
const mockUpsert = vi.fn();
const mockDelete = vi.fn();
const mockEq = vi.fn();

const mockQueryBuilder = {
  select: mockSelect,
  upsert: mockUpsert,
  delete: mockDelete,
  eq: mockEq,
};

// Set up method chaining
mockSelect.mockReturnValue(mockQueryBuilder);
mockUpsert.mockReturnValue(mockQueryBuilder);
mockDelete.mockReturnValue(mockQueryBuilder);
mockEq.mockReturnValue(Promise.resolve({ data: null, error: null }));

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => mockQueryBuilder),
  },
}));

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

describe('AdminProductsPage CRUD Operations', () => {
  const mockProducts = [
    {
      id: 'prod-1',
      name: 'Bronze Ganesha',
      category: 'Temple',
      price: 15000,
      stock: 5,
      description: 'Handcrafted bronze Ganesha statue.',
      image_url: 'https://example.com/ganesha.jpg',
    },
    {
      id: 'prod-2',
      name: 'Marble Krishna',
      category: 'Home Decor',
      price: 25000,
      stock: 2,
      description: 'Elegant white marble Krishna statue.',
      image_url: 'https://example.com/krishna.jpg',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useProductsQuery).mockReturnValue({
      isLoading: false,
      data: mockProducts,
      error: null,
      refetch: vi.fn(),
    } as any);
  });

  afterEach(() => {
    cleanup();
  });

  it('renders products list and controls correctly', () => {
    render(<AdminProductsPage />, { wrapper: createWrapper() });

    expect(screen.getByText('Products Catalog')).toBeDefined();
    expect(screen.getByPlaceholderText(/Search products/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Add Product/i })).toBeDefined();

    // Verify product cards or table rows render
    expect(screen.getByText('Bronze Ganesha')).toBeDefined();
    expect(screen.getByText('Marble Krishna')).toBeDefined();
  });

  it('filters product list by search query', async () => {
    render(<AdminProductsPage />, { wrapper: createWrapper() });

    const searchInput = screen.getByPlaceholderText(/Search products/i);
    fireEvent.change(searchInput, { target: { value: 'Krishna' } });

    // Should display Marble Krishna, but not Bronze Ganesha
    expect(screen.getByText('Marble Krishna')).toBeDefined();
    expect(screen.queryByText('Bronze Ganesha')).toBeNull();
  });

  it('filters product list by category selection', async () => {
    render(<AdminProductsPage />, { wrapper: createWrapper() });

    const categorySelect = screen.getByRole('combobox', { name: /Filter by Category/i });
    fireEvent.change(categorySelect, { target: { value: 'Temple' } });

    // Should display Bronze Ganesha, but not Marble Krishna
    expect(screen.getByText('Bronze Ganesha')).toBeDefined();
    expect(screen.queryByText('Marble Krishna')).toBeNull();
  });

  it('opens create modal, validates form, and shows error messages', async () => {
    render(<AdminProductsPage />, { wrapper: createWrapper() });

    const addButton = screen.getByRole('button', { name: /Add Product/i });
    fireEvent.click(addButton);

    // Modal title should be visible
    expect(screen.getByText('Add New Product')).toBeDefined();

    const submitButton = screen.getByRole('button', { name: /Save Product/i });
    fireEvent.click(submitButton);

    // Assert validation error messages (since fields are empty)
    await waitFor(() => {
      expect(screen.getByText('Product name must be at least 3 characters')).toBeDefined();
      expect(screen.getByText('Category is required')).toBeDefined();
      expect(screen.getByText('Price must be a non-negative number')).toBeDefined();
      expect(screen.getByText('Stock must be a non-negative integer')).toBeDefined();
    });
  });

  it('submits valid new product form and calls supabase upsert', async () => {
    mockUpsert.mockResolvedValueOnce({ data: null, error: null });

    render(<AdminProductsPage />, { wrapper: createWrapper() });

    const addButton = screen.getByRole('button', { name: /Add Product/i });
    fireEvent.click(addButton);

    fireEvent.change(screen.getByLabelText(/Product Name/i), { target: { value: 'Wooden Saraswati' } });
    fireEvent.change(screen.getByLabelText('Category'), { target: { value: 'Office' } });
    fireEvent.change(screen.getByLabelText(/Price/i), { target: { value: '18000' } });
    fireEvent.change(screen.getByLabelText(/Stock/i), { target: { value: '4' } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'Beautifully hand-carved wooden statue.' } });
    fireEvent.change(screen.getByLabelText(/Image URL/i), { target: { value: 'https://example.com/saraswati.jpg' } });

    const submitButton = screen.getByRole('button', { name: /Save Product/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('products');
      expect(mockUpsert).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Wooden Saraswati',
          category: 'Office',
          price: 18000,
          stock: 4,
          description: 'Beautifully hand-carved wooden statue.',
          image_url: 'https://example.com/saraswati.jpg',
        })
      );
    });
  });

  it('opens edit modal with pre-populated values and submits edits', async () => {
    mockUpsert.mockResolvedValueOnce({ data: null, error: null });

    render(<AdminProductsPage />, { wrapper: createWrapper() });

    // Click Edit button for Bronze Ganesha (prod-1)
    const editButtons = screen.getAllByRole('button', { name: /Edit/i });
    fireEvent.click(editButtons[0]); // First one is prod-1

    expect(screen.getByText('Edit Product')).toBeDefined();
    expect((screen.getByLabelText(/Product Name/i) as HTMLInputElement).value).toBe('Bronze Ganesha');

    // Change price
    fireEvent.change(screen.getByLabelText(/Price/i), { target: { value: '16000' } });

    const submitButton = screen.getByRole('button', { name: /Save Product/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('products');
      expect(mockUpsert).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'prod-1',
          name: 'Bronze Ganesha',
          category: 'Temple',
          price: 16000,
          stock: 5,
          description: 'Handcrafted bronze Ganesha statue.',
          image_url: 'https://example.com/ganesha.jpg',
        })
      );
    });
  });

  it('calls supabase delete when delete button is clicked and confirmed', async () => {
    mockEq.mockResolvedValueOnce({ data: null, error: null });

    render(<AdminProductsPage />, { wrapper: createWrapper() });

    // Click Delete button for Marble Krishna (prod-2)
    const deleteButtons = screen.getAllByRole('button', { name: /Delete/i });
    fireEvent.click(deleteButtons[1]); // Second one is prod-2

    // Verify custom modal elements appear
    expect(screen.getByRole('heading', { name: 'Delete Product' })).toBeDefined();
    expect(screen.getByText(/Are you sure you want to delete/i)).toBeDefined();

    // Click the confirmation button inside modal
    const confirmButton = screen.getByRole('button', { name: 'Delete Product' });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('products');
      expect(mockDelete).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith('id', 'prod-2');
    });
  });
});
