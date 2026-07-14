// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AdminGuard } from '../AdminGuard';
import { useAppStore } from '@/store/useAppStore';

// Mock Supabase to avoid missing env var error and network calls
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
    },
  },
}));

describe('AdminGuard', () => {
  beforeEach(() => {
    // Reset Zustand store state before each test
    useAppStore.setState({ user: null });
  });

  afterEach(() => {
    cleanup();
  });

  it('shows login page when user is not logged in', () => {
    useAppStore.setState({ user: null });
    render(
      <MemoryRouter initialEntries={['/admin-dashboard']}>
        <Routes>
          <Route path="/admin-dashboard" element={<AdminGuard />}>
            <Route index element={<div>Admin Dashboard Page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText(/admin login/i)).toBeDefined();
    expect(screen.queryByText('Admin Dashboard Page')).toBeNull();
  });

  it('shows login page and access denied when user is logged in but not an admin', () => {
    useAppStore.setState({
      user: {
        id: 'user-123',
        name: 'Regular User',
        email: 'user@example.com',
        is_admin: false,
      },
    });

    render(
      <MemoryRouter initialEntries={['/admin-dashboard']}>
        <Routes>
          <Route path="/admin-dashboard" element={<AdminGuard />}>
            <Route index element={<div>Admin Dashboard Page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/access denied/i)).toBeDefined();
    expect(screen.getByText(/user@example.com/i)).toBeDefined();
    expect(screen.queryByText('Admin Dashboard Page')).toBeNull();
  });

  it('renders children routes when user is logged in and is an admin', () => {
    useAppStore.setState({
      user: {
        id: 'admin-123',
        name: 'Admin User',
        email: 'admin@shasjewellery.com',
        is_admin: true,
      },
    });

    render(
      <MemoryRouter initialEntries={['/admin-dashboard']}>
        <Routes>
          <Route path="/admin-dashboard" element={<AdminGuard />}>
            <Route index element={<div>Admin Dashboard Page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Admin Dashboard Page')).toBeDefined();
    expect(screen.queryByText(/admin login/i)).toBeNull();
  });
});
