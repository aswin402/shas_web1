// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react';
import { LoginForm } from '../LoginForm';
import { supabase } from '@/lib/supabase';

// Mock Supabase client
vi.mock('@/lib/supabase', () => {
  return {
    supabase: {
      auth: {
        signInWithPassword: vi.fn(),
      },
    },
  };
});

describe('LoginForm', () => {
  const mockOnToggleView = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders all login fields and submit button', () => {
    render(<LoginForm onToggleView={mockOnToggleView} />);

    expect(screen.getByLabelText(/Username, Email, or Phone/i)).toBeDefined();
    expect(screen.getByLabelText(/Password/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeDefined();
  });

  it('calls onToggleView when clicking Create One button', () => {
    render(<LoginForm onToggleView={mockOnToggleView} />);
    
    const toggleButton = screen.getByRole('button', { name: /Create one/i });
    fireEvent.click(toggleButton);

    expect(mockOnToggleView).toHaveBeenCalledTimes(1);
  });

  it('submits form with credentials and handles success', async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValueOnce({
      data: { user: {} } as any,
      error: null,
    });

    render(<LoginForm onToggleView={mockOnToggleView} />);

    const emailInput = screen.getByLabelText(/Username, Email, or Phone/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Sign In/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(screen.queryByText(/Incorrect email or password/i)).toBeNull();
  });

  it('handles and displays error message from Supabase auth', async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValueOnce({
      data: { user: null } as any,
      error: { message: 'Invalid login credentials' } as any,
    });

    render(<LoginForm onToggleView={mockOnToggleView} />);

    const emailInput = screen.getByLabelText(/Username, Email, or Phone/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Sign In/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrong-password' } });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'wrong-password',
    });
    
    // Error message should be rendered
    expect(screen.getByText('Invalid login credentials')).toBeDefined();
  });
});
