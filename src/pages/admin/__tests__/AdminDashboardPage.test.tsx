// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { AdminDashboardPage } from '../AdminDashboardPage';
import { useProductsQuery } from '@/hooks/useProducts';
import { useContactSubmissions } from '@/hooks/useContactSubmissions';
import { MemoryRouter } from 'react-router-dom';

// Mock the React Query hooks
vi.mock('@/hooks/useProducts', () => ({
  useProductsQuery: vi.fn(),
}));

vi.mock('@/hooks/useContactSubmissions', () => ({
  useContactSubmissions: vi.fn(),
}));

describe('AdminDashboardPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders loading state when queries are loading', () => {
    vi.mocked(useProductsQuery).mockReturnValue({
      isLoading: true,
      data: undefined,
      error: null,
    } as any);

    vi.mocked(useContactSubmissions).mockReturnValue({
      isLoading: true,
      data: undefined,
      error: null,
    } as any);

    render(
      <MemoryRouter>
        <AdminDashboardPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/loading/i)).toBeDefined();
  });

  it('renders error state when a query fails', () => {
    vi.mocked(useProductsQuery).mockReturnValue({
      isLoading: false,
      isError: true,
      error: new Error('Failed to fetch products'),
      data: undefined,
    } as any);

    vi.mocked(useContactSubmissions).mockReturnValue({
      isLoading: false,
      data: [],
      error: null,
    } as any);

    render(
      <MemoryRouter>
        <AdminDashboardPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/failed to fetch products/i)).toBeDefined();
  });

  it('calculates metrics and renders dashboard data correctly', () => {
    const mockProducts = [
      { id: '1', name: 'Ganesha Statue', price: 1500, stock: 10, category: 'Temple' },
      { id: '2', name: 'Krishna Statue', price: 2500, stock: 3, category: 'Home' },
      { id: '3', name: 'Shiva Statue', price: 5000, stock: 0, category: 'Temple' },
      { id: '4', name: 'Saraswati Statue', price: 1200, stock: 15, category: 'Office' },
    ];

    const mockSubmissions = [
      { id: 'sub-1', name: 'Aswin', email: 'aswin@example.com', subject: 'Custom Ganesha', message: 'I need a custom statue', created_at: '2026-06-27T10:00:00Z' },
      { id: 'sub-2', name: 'John', email: 'john@example.com', subject: 'Shipping query', message: 'Do you ship to US?', created_at: '2026-06-27T11:00:00Z' },
    ];

    vi.mocked(useProductsQuery).mockReturnValue({
      isLoading: false,
      data: mockProducts,
      error: null,
    } as any);

    vi.mocked(useContactSubmissions).mockReturnValue({
      isLoading: false,
      data: mockSubmissions,
      error: null,
    } as any);

    render(
      <MemoryRouter>
        <AdminDashboardPage />
      </MemoryRouter>
    );

    // Verify Title
    expect(screen.getByText(/admin dashboard/i)).toBeDefined();

    // Total Catalog Items: 4
    expect(screen.getByText('4')).toBeDefined();
    
    // Total Inventory Value: (1500*10) + (2500*3) + (5000*0) + (1200*15) = 15000 + 7500 + 0 + 18000 = 40500
    // Check if the valuation displays 40500 (with or without formatting)
    expect(screen.getByText(/40,500/)).toBeDefined();

    // Low stock warnings: Krishna Statue (3 < 5) and Shiva Statue (0 < 5) => 2
    // Messages/Inquiries count: 2
    // Both metrics are '2', so we expect two elements displaying '2' in the stat cards.
    expect(screen.getAllByText('2')).toHaveLength(2);

    // Low stock list rendering
    expect(screen.getByText('Krishna Statue')).toBeDefined();
    expect(screen.getByText('Shiva Statue')).toBeDefined();
    expect(screen.queryByText('Ganesha Statue')).toBeNull(); // Should not be in low stock list

    // Message summaries rendering
    expect(screen.getByText(/Custom Ganesha/i)).toBeDefined();
    expect(screen.getByText(/Shipping query/i)).toBeDefined();
  });
});
