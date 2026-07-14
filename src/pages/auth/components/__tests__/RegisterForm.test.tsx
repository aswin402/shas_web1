// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react';
import { RegisterForm } from '../RegisterForm';
import { supabase } from '@/lib/supabase';

// Mock Supabase client
vi.mock('@/lib/supabase', () => {
  const queryBuilder = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
  };
  return {
    supabase: {
      auth: {
        signUp: vi.fn(),
        signInWithOAuth: vi.fn(),
      },
      from: vi.fn().mockReturnValue(queryBuilder),
    },
  };
});

describe('RegisterForm', () => {
  const mockOnToggleView = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders all registration fields and submit button', () => {
    render(<RegisterForm onToggleView={mockOnToggleView} />);

    expect(screen.getByLabelText(/First Name/i)).toBeDefined();
    expect(screen.getByLabelText(/Last Name/i)).toBeDefined();
    expect(screen.getByLabelText(/Username/i)).toBeDefined();
    expect(screen.getByLabelText(/Email Address/i)).toBeDefined();
    expect(screen.getByLabelText(/Password/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Create Account/i })).toBeDefined();
  });

  it('calls onToggleView when clicking Sign In button', () => {
    render(<RegisterForm onToggleView={mockOnToggleView} />);
    
    const toggleButton = screen.getByRole('button', { name: /Sign in/i });
    fireEvent.click(toggleButton);

    expect(mockOnToggleView).toHaveBeenCalledTimes(1);
  });

  it('submits form with user data and handles success', async () => {
    vi.mocked(supabase.auth.signUp).mockResolvedValueOnce({
      data: { user: {} } as any,
      error: null,
    });

    render(<RegisterForm onToggleView={mockOnToggleView} />);

    const firstNameInput = screen.getByLabelText(/First Name/i);
    const lastNameInput = screen.getByLabelText(/Last Name/i);
    const usernameInput = screen.getByLabelText(/Username/i);
    const emailInput = screen.getByLabelText(/Email Address/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Create Account/i });

    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.change(usernameInput, { target: { value: 'johndoe' } });
    fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email: 'john.doe@example.com',
      password: 'password123',
      options: {
        data: {
          full_name: 'John Doe',
          username: 'johndoe',
        },
      },
    });

    // Success screen should be rendered
    expect(screen.getByText('Registration Successful')).toBeDefined();
    expect(screen.getByText(/Please check your email to confirm your account/i)).toBeDefined();
  });

  it('handles and displays error message from Supabase auth signUp', async () => {
    vi.mocked(supabase.auth.signUp).mockResolvedValueOnce({
      data: { user: null } as any,
      error: { message: 'User already exists' } as any,
    });

    render(<RegisterForm onToggleView={mockOnToggleView} />);

    const firstNameInput = screen.getByLabelText(/First Name/i);
    const lastNameInput = screen.getByLabelText(/Last Name/i);
    const usernameInput = screen.getByLabelText(/Username/i);
    const emailInput = screen.getByLabelText(/Email Address/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Create Account/i });

    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.change(usernameInput, { target: { value: 'johndoe' } });
    fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(supabase.auth.signUp).toHaveBeenCalled();
    
    // Error message should be rendered
    expect(screen.getByText('User already exists')).toBeDefined();
    // Form should still be shown, not success screen
    expect(screen.queryByText('Registration Successful')).toBeNull();
  });
});
