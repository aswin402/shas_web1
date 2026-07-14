import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

function createSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      'Supabase env vars (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY) not set. ' +
      'Shop page will use local fallback data.'
    );
    
    const mockAuth = {
      onAuthStateChange: (callback: (event: string, session: any) => void) => {
        setTimeout(() => {
          try {
            callback('SIGNED_OUT', null);
          } catch (e) {
            console.error('Error in mock auth callback:', e);
          }
        }, 0);
        return {
          data: {
            subscription: {
              unsubscribe: () => {}
            }
          }
        };
      },
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      signInWithPassword: () => Promise.resolve({ data: {}, error: new Error('Supabase not configured') }),
      signOut: () => Promise.resolve({ error: null }),
    };

    const mockStorage = {
      from: () => ({
        upload: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
      })
    };

    const createMockQueryBuilder = () => {
      const builder: any = {
        select: () => builder,
        eq: () => builder,
        match: () => builder,
        order: () => builder,
        single: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
        insert: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
        upsert: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
        update: () => builder,
        delete: () => builder,
        then: (onfulfilled: any) => {
          return Promise.resolve({ data: null, error: new Error('Supabase not configured') }).then(onfulfilled);
        }
      };
      return builder;
    };

    return {
      auth: mockAuth,
      storage: mockStorage,
      from: () => createMockQueryBuilder(),
    } as unknown as ReturnType<typeof createClient>;
  }
  return createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = createSupabaseClient();
