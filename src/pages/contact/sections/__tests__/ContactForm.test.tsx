// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react';
import { ContactForm } from '../ContactForm';
import { supabase } from '@/lib/supabase';

// Mock useScrollAnimation hook to return isVisible: true
vi.mock('@/hooks/useScrollAnimation', () => {
  return {
    useScrollAnimation: () => ({
      ref: { current: null },
      isVisible: true,
    }),
  };
});

// Mock Supabase client
vi.mock('@/lib/supabase', () => {
  const mockFrom = vi.fn();
  return {
    supabase: {
      from: mockFrom,
    },
  };
});

describe('ContactForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders all form fields and submit button', () => {
    render(<ContactForm />);

    expect(screen.getByLabelText(/Full Name/i)).toBeDefined();
    expect(screen.getByLabelText(/Email Address/i)).toBeDefined();
    expect(screen.getByLabelText(/Phone Number/i)).toBeDefined();
    expect(screen.getByLabelText(/Inquiry Type/i)).toBeDefined();
    expect(screen.getByLabelText(/Preferred Material/i)).toBeDefined();
    expect(screen.getByLabelText(/Budget Range/i)).toBeDefined();
    expect(screen.getByLabelText(/Message/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Submit Inquiry/i })).toBeDefined();
  });

  it('displays validation errors on empty submission', async () => {
    render(<ContactForm />);

    const submitButton = screen.getByRole('button', { name: /Submit Inquiry/i });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(screen.getByText(/Name is required/i)).toBeDefined();
    expect(screen.getByText(/Email is required/i)).toBeDefined();
    expect(screen.getByText(/Message is required/i)).toBeDefined();
  });

  it('submits form data successfully to Supabase and resets fields', async () => {
    const mockInsert = vi.fn().mockResolvedValueOnce({ error: null });
    vi.mocked(supabase.from).mockReturnValue({
      insert: mockInsert,
    } as any);

    render(<ContactForm />);

    const nameInput = screen.getByLabelText(/Full Name/i);
    const emailInput = screen.getByLabelText(/Email Address/i);
    const messageInput = screen.getByLabelText(/Message/i);
    const inquirySelect = screen.getByLabelText(/Inquiry Type/i);
    const submitButton = screen.getByRole('button', { name: /Submit Inquiry/i });

    fireEvent.change(nameInput, { target: { value: 'Aswin Kumar' } });
    fireEvent.change(emailInput, { target: { value: 'aswin@example.com' } });
    fireEvent.change(messageInput, { target: { value: 'Looking for a custom brass statue.' } });
    fireEvent.change(inquirySelect, { target: { value: 'custom-order' } });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(supabase.from).toHaveBeenCalledWith('contact_submissions');
    expect(mockInsert).toHaveBeenCalledWith({
      name: 'Aswin Kumar',
      email: 'aswin@example.com',
      subject: 'custom-order',
      message: 'Looking for a custom brass statue.',
    });

    // Check success state
    expect(screen.getByText(/Thank you! Your inquiry has been sent/i)).toBeDefined();

    // Check form is reset
    expect((nameInput as HTMLInputElement).value).toBe('');
    expect((emailInput as HTMLInputElement).value).toBe('');
    expect((messageInput as HTMLTextAreaElement).value).toBe('');
  });

  it('handles submission error and displays the error message', async () => {
    const mockInsert = vi.fn().mockResolvedValueOnce({
      error: { message: 'Database constraint violation' },
    });
    vi.mocked(supabase.from).mockReturnValue({
      insert: mockInsert,
    } as any);

    render(<ContactForm />);

    const nameInput = screen.getByLabelText(/Full Name/i);
    const emailInput = screen.getByLabelText(/Email Address/i);
    const messageInput = screen.getByLabelText(/Message/i);
    const submitButton = screen.getByRole('button', { name: /Submit Inquiry/i });

    fireEvent.change(nameInput, { target: { value: 'Aswin Kumar' } });
    fireEvent.change(emailInput, { target: { value: 'aswin@example.com' } });
    fireEvent.change(messageInput, { target: { value: 'Testing error handling.' } });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(screen.getByText('Database constraint violation')).toBeDefined();
    expect(screen.queryByText(/Thank you! Your inquiry has been sent/i)).toBeNull();
  });
});
