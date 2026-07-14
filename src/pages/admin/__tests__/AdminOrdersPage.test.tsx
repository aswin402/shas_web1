// @vitest-environment happy-dom
import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { AdminOrdersPage } from '../AdminOrdersPage';
import { useAdminOrdersQuery, useUpdateOrderStatusMutation } from '@/hooks/useOrders';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock the query hook
vi.mock('@/hooks/useOrders', () => ({
  useAdminOrdersQuery: vi.fn(),
  useUpdateOrderStatusMutation: vi.fn(),
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

describe('AdminOrdersPage', () => {
  const mockOrders = [
    {
      id: 'order-1',
      user_id: 'user-a',
      status: 'Pending',
      total_amount: 15000,
      shipping_address: {
        fullName: 'Jane Doe',
        street: '123 Temple Road',
        city: 'Varanasi',
        state: 'Uttar Pradesh',
        zipCode: '221001',
        phone: '9876543210'
      },
      payment_status: 'Paid',
      created_at: '2026-06-27T10:00:00.000Z',
      order_items: [
        {
          id: 'item-1',
          quantity: 1,
          price: 15000,
          products: {
            id: 'prod-1',
            name: 'Bronze Dancing Shiva',
            image_url: 'https://example.com/shiva.jpg',
            category: 'Temple'
          }
        }
      ]
    },
    {
      id: 'order-2',
      user_id: 'user-b',
      status: 'Delivered',
      total_amount: 8500,
      shipping_address: {
        fullName: 'Amit Patel',
        street: '45 Lotus Lane',
        city: 'Ahmedabad',
        state: 'Gujarat',
        zipCode: '380001',
        phone: '8765432109'
      },
      payment_status: 'Unpaid',
      created_at: '2026-06-26T15:30:00.000Z',
      order_items: [
        {
          id: 'item-2',
          quantity: 2,
          price: 4250,
          products: {
            id: 'prod-2',
            name: 'Stone Saraswati',
            image_url: 'https://example.com/saraswati.jpg',
            category: 'Home Decor'
          }
        }
      ]
    }
  ];

  const mockMutateAsync = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useUpdateOrderStatusMutation).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false
    } as any);
  });

  afterEach(() => {
    cleanup();
  });

  it('renders loading state when query is loading', () => {
    vi.mocked(useAdminOrdersQuery).mockReturnValue({
      isLoading: true,
      data: undefined,
      error: null,
    } as any);

    render(<AdminOrdersPage />, { wrapper: createWrapper() });

    expect(screen.getByText(/loading client orders/i)).toBeDefined();
  });

  it('renders error state when query fails', () => {
    vi.mocked(useAdminOrdersQuery).mockReturnValue({
      isLoading: false,
      isError: true,
      error: new Error('Failed to load database orders'),
      data: undefined,
    } as any);

    render(<AdminOrdersPage />, { wrapper: createWrapper() });

    expect(screen.getByText(/failed to load orders/i)).toBeDefined();
    expect(screen.getByText('Failed to load database orders')).toBeDefined();
  });

  it('renders empty state when there are no orders', () => {
    vi.mocked(useAdminOrdersQuery).mockReturnValue({
      isLoading: false,
      data: [],
      error: null,
    } as any);

    render(<AdminOrdersPage />, { wrapper: createWrapper() });

    expect(screen.getByText('No Orders Found')).toBeDefined();
  });

  it('renders list of orders correctly', () => {
    vi.mocked(useAdminOrdersQuery).mockReturnValue({
      isLoading: false,
      data: mockOrders,
      error: null,
    } as any);

    render(<AdminOrdersPage />, { wrapper: createWrapper() });

    expect(screen.getByText('Jane Doe')).toBeDefined();
    expect(screen.getByText('9876543210')).toBeDefined();
    expect(screen.getByText('Amit Patel')).toBeDefined();
    expect(screen.getByRole('cell', { name: 'Pending' })).toBeDefined();
    expect(screen.getByRole('cell', { name: 'Delivered' })).toBeDefined();
  });

  it('filters orders by search term', () => {
    vi.mocked(useAdminOrdersQuery).mockReturnValue({
      isLoading: false,
      data: mockOrders,
      error: null,
    } as any);

    render(<AdminOrdersPage />, { wrapper: createWrapper() });

    const searchInput = screen.getByPlaceholderText(/search by order id/i);
    fireEvent.change(searchInput, { target: { value: 'Jane' } });

    expect(screen.getByText('Jane Doe')).toBeDefined();
    expect(screen.queryByText('Amit Patel')).toBeNull();
  });

  it('filters orders by status select', () => {
    vi.mocked(useAdminOrdersQuery).mockReturnValue({
      isLoading: false,
      data: mockOrders,
      error: null,
    } as any);

    render(<AdminOrdersPage />, { wrapper: createWrapper() });

    const select = screen.getByLabelText('Status');
    fireEvent.change(select, { target: { value: 'Delivered' } });

    expect(screen.queryByText('Jane Doe')).toBeNull();
    expect(screen.getByText('Amit Patel')).toBeDefined();
  });

  it('opens details modal when clicking on an order and triggers status change', async () => {
    vi.mocked(useAdminOrdersQuery).mockReturnValue({
      isLoading: false,
      data: mockOrders,
      error: null,
    } as any);

    render(<AdminOrdersPage />, { wrapper: createWrapper() });

    // Click the first order row
    const row = screen.getByText('Jane Doe').closest('tr')!;
    fireEvent.click(row);

    // Verify modal is open
    expect(screen.getByRole('heading', { name: 'Order Details' })).toBeDefined();
    expect(screen.getByText('123 Temple Road')).toBeDefined();

    // Trigger status change inside modal
    const select = screen.getByLabelText('Fulfillment Status');
    fireEvent.change(select, { target: { value: 'Shipped' } });

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        orderId: 'order-1',
        status: 'Shipped'
      });
    });
  });
});
