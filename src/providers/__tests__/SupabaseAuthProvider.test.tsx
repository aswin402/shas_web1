// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { SupabaseAuthProvider } from '../SupabaseAuthProvider';
import { supabase } from '../../lib/supabase';
import { useAppStore } from '../../store/useAppStore';

// Mock supabase client
const mockSessionState = {
  session: null as any,
};

const mockSubscription = {
  unsubscribe: vi.fn(),
};

let currentUserId = '';
let isSingle = false;

vi.mock('../../lib/supabase', () => {
  const queryBuilder = {
    select: vi.fn().mockImplementation(() => {
      isSingle = false;
      return queryBuilder;
    }),
    eq: vi.fn().mockImplementation((col, val) => {
      if (col === 'id') currentUserId = val;
      return queryBuilder;
    }),
    single: vi.fn().mockImplementation(() => {
      isSingle = true;
      return queryBuilder;
    }),
    then: vi.fn().mockImplementation((onFulfilled) => {
      if (isSingle) {
        if (currentUserId === 'user-id') {
          return Promise.resolve(onFulfilled({
            data: { username: 'test_user', phone: '+1234567890', full_name: 'Test User', email: 'test@example.com', is_admin: true },
            error: null
          }));
        } else if (currentUserId === 'signedin-id') {
          return Promise.resolve(onFulfilled({
            data: { username: 'signedin_user', phone: '+9876543210', full_name: 'Signed In User', email: 'signedin@example.com', is_admin: false },
            error: null
          }));
        }
        return Promise.resolve(onFulfilled({ data: null, error: null }));
      }
      return Promise.resolve(onFulfilled({ data: [], error: null }));
    }),
    upsert: vi.fn().mockImplementation(() => Promise.resolve({ data: [], error: null })),
    insert: vi.fn().mockImplementation(() => Promise.resolve({ data: [], error: null })),
    update: vi.fn(),
    delete: vi.fn(),
    match: vi.fn().mockImplementation(() => Promise.resolve({ data: [], error: null })),
  };
  queryBuilder.update.mockReturnValue(queryBuilder);
  queryBuilder.delete.mockReturnValue(queryBuilder);

  return {
    supabase: {
      auth: {
        getSession: vi.fn().mockImplementation(() => Promise.resolve({
          data: { session: mockSessionState.session },
          error: null,
        })),
        onAuthStateChange: vi.fn().mockImplementation((callback) => {
          callback('INITIAL_SESSION', mockSessionState.session);
          return {
            data: { subscription: mockSubscription },
          };
        }),
      },
      from: vi.fn().mockReturnValue(queryBuilder),
    },
  };
});

describe('SupabaseAuthProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSessionState.session = null;
    currentUserId = '';
    isSingle = false;
    // Reset Zustand store state
    useAppStore.setState({ user: null, isLoading: false });
  });

  it('renders children correctly', async () => {
    await act(async () => {
      render(
        <SupabaseAuthProvider>
          <div data-testid="child">Test Child</div>
        </SupabaseAuthProvider>
      );
    });

    expect(screen.getByTestId('child')).toBeDefined();
    expect(screen.getByText('Test Child')).toBeDefined();
  });

  it('checks session on mount and sets user when logged in', async () => {
    const mockUser = {
      id: 'user-id',
      email: 'test@example.com',
      user_metadata: {
        full_name: 'Test User',
      },
    };

    mockSessionState.session = {
      user: mockUser,
    } as any;

    await act(async () => {
      render(
        <SupabaseAuthProvider>
          <div>Child</div>
        </SupabaseAuthProvider>
      );
    });

    // Verify useAppStore was updated
    const state = useAppStore.getState();
    expect(state.user).toEqual({
      id: 'user-id',
      name: 'Test User',
      email: 'test@example.com',
      phone: '+1234567890',
      username: 'test_user',
      is_admin: true,
    });
    expect(state.isLoading).toBe(false);
  });

  it('sets user to null when no session is active', async () => {
    // Set store user to some initial state to verify it gets cleared
    useAppStore.setState({ user: { id: 'old', name: 'Old User', email: 'old@example.com' }, isLoading: true });

    mockSessionState.session = null;

    await act(async () => {
      render(
        <SupabaseAuthProvider>
          <div>Child</div>
        </SupabaseAuthProvider>
      );
    });

    const state = useAppStore.getState();
    expect(state.user).toBeNull();
    expect(state.isLoading).toBe(false);
  });

  it('listens to auth state changes and updates store', async () => {
    let authCallback: any;

    // Capture the callback registered with onAuthStateChange
    vi.mocked(supabase.auth.onAuthStateChange).mockImplementationOnce((callback) => {
      authCallback = callback;
      return {
        data: {
          subscription: { unsubscribe: vi.fn() },
        },
      } as any;
    });

    await act(async () => {
      render(
        <SupabaseAuthProvider>
          <div>Child</div>
        </SupabaseAuthProvider>
      );
    });

    // Simulate callback trigger for signed in user
    await act(async () => {
      await authCallback('SIGNED_IN', {
        user: {
          id: 'signedin-id',
          email: 'signedin@example.com',
          user_metadata: {
            full_name: 'Signed In User',
          },
        },
      });
    });

    expect(useAppStore.getState().user).toEqual({
      id: 'signedin-id',
      name: 'Signed In User',
      email: 'signedin@example.com',
      phone: '+9876543210',
      username: 'signedin_user',
      is_admin: false,
    });

    // Simulate callback trigger for signed out
    await act(async () => {
      await authCallback('SIGNED_OUT', null);
    });

    expect(useAppStore.getState().user).toBeNull();
  });

  it('unsubscribes on unmount', async () => {
    const unsubscribeMock = vi.fn();
    vi.mocked(supabase.auth.onAuthStateChange).mockReturnValueOnce({
      data: {
        subscription: { unsubscribe: unsubscribeMock },
      },
    } as any);

    let renderResult: any;
    await act(async () => {
      renderResult = render(
        <SupabaseAuthProvider>
          <div>Child</div>
        </SupabaseAuthProvider>
      );
    });

    await act(async () => {
      renderResult.unmount();
    });

    expect(unsubscribeMock).toHaveBeenCalledTimes(1);
  });
});
