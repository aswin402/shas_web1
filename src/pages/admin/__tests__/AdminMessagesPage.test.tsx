// @vitest-environment happy-dom
import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { AdminMessagesPage } from '../AdminMessagesPage';
import { useContactSubmissions } from '@/hooks/useContactSubmissions';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock the query hook
vi.mock('@/hooks/useContactSubmissions', () => ({
  useContactSubmissions: vi.fn(),
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

describe('AdminMessagesPage', () => {
  const mockSubmissions = [
    {
      id: 'sub-1',
      name: 'Aswin Kumar',
      email: 'aswin@example.com',
      subject: 'Custom Statue Inquiry',
      message: 'I want a custom Ganesha statue made of bronze with 4 feet height.',
      created_at: '2026-06-27T10:00:00.000Z',
    },
    {
      id: 'sub-2',
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Shipping to USA',
      message: 'Do you provide international shipping to New York?',
      created_at: '2026-06-26T15:30:00.000Z',
    },
    {
      id: 'sub-3',
      name: 'Jane Smith',
      email: 'jane@example.com',
      subject: null,
      message: 'General feedback about the website layout and performance.',
      created_at: '2026-06-25T09:15:00.000Z',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders loading state when query is loading', () => {
    vi.mocked(useContactSubmissions).mockReturnValue({
      isLoading: true,
      data: undefined,
      error: null,
    } as any);

    render(<AdminMessagesPage />, { wrapper: createWrapper() });

    expect(screen.getByText(/loading inquiries/i)).toBeDefined();
  });

  it('renders error state when query fails and does not show empty state', () => {
    vi.mocked(useContactSubmissions).mockReturnValue({
      isLoading: false,
      isError: true,
      error: new Error('Database connection failed'),
      data: undefined,
    } as any);

    render(<AdminMessagesPage />, { wrapper: createWrapper() });

    expect(screen.getByText(/database connection failed/i)).toBeDefined();
    expect(screen.queryByText('No Inquiries Found')).toBeNull();
  });

  it('renders list of contact submissions correctly', () => {
    vi.mocked(useContactSubmissions).mockReturnValue({
      isLoading: false,
      data: mockSubmissions,
      error: null,
    } as any);

    render(<AdminMessagesPage />, { wrapper: createWrapper() });

    expect(screen.getByText('Customer Inquiries')).toBeDefined();
    expect(screen.getByText('Aswin Kumar')).toBeDefined();
    expect(screen.getByText('aswin@example.com')).toBeDefined();
    expect(screen.getByText('Custom Statue Inquiry')).toBeDefined();

    expect(screen.getByText('John Doe')).toBeDefined();
    expect(screen.getByText('john@example.com')).toBeDefined();
    expect(screen.getByText('Shipping to USA')).toBeDefined();

    expect(screen.getByText('Jane Smith')).toBeDefined();
    expect(screen.getByText('jane@example.com')).toBeDefined();
    expect(screen.getByText('(No Subject)')).toBeDefined();
  });

  it('filters submissions by search term (name, email, or subject)', () => {
    vi.mocked(useContactSubmissions).mockReturnValue({
      isLoading: false,
      data: mockSubmissions,
      error: null,
    } as any);

    render(<AdminMessagesPage />, { wrapper: createWrapper() });

    const searchInput = screen.getByPlaceholderText(/search inquiries/i);

    // Search by name (Aswin)
    fireEvent.change(searchInput, { target: { value: 'aswin' } });
    expect(screen.queryByText('Aswin Kumar')).toBeDefined();
    expect(screen.queryByText('John Doe')).toBeNull();
    expect(screen.queryByText('Jane Smith')).toBeNull();

    // Search by email (john)
    fireEvent.change(searchInput, { target: { value: 'john@example.com' } });
    expect(screen.queryByText('Aswin Kumar')).toBeNull();
    expect(screen.queryByText('John Doe')).toBeDefined();
    expect(screen.queryByText('Jane Smith')).toBeNull();

    // Search by subject (USA)
    fireEvent.change(searchInput, { target: { value: 'usa' } });
    expect(screen.queryByText('Aswin Kumar')).toBeNull();
    expect(screen.queryByText('John Doe')).toBeDefined();
    expect(screen.queryByText('Jane Smith')).toBeNull();
  });

  it('opens details modal when clicking on view button and closes it', () => {
    vi.mocked(useContactSubmissions).mockReturnValue({
      isLoading: false,
      data: mockSubmissions,
      error: null,
    } as any);

    render(<AdminMessagesPage />, { wrapper: createWrapper() });

    // Modal should not be present initially
    expect(screen.queryByText('Inquiry Details')).toBeNull();

    // Click the view button for the first submission
    const viewButtons = screen.getAllByRole('button', { name: /view/i });
    fireEvent.click(viewButtons[0]);

    // Modal should be opened and display details
    expect(screen.getByText('Inquiry Details')).toBeDefined();
    expect(screen.getAllByText('I want a custom Ganesha statue made of bronze with 4 feet height.').length).toBeGreaterThanOrEqual(1);

    // Click close button
    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);

    // Modal should be closed
    expect(screen.queryByText('Inquiry Details')).toBeNull();
  });
});
