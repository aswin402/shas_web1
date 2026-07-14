import React, { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAppStore } from '../store/useAppStore';

async function fetchOrCreateProfile(userId: string, userEmail: string, userMeta: Record<string, string>) {
  console.log('[AUTH DEBUG] Fetching profile for user:', userId, userEmail);

  // Try fetching the profile
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('username, phone, full_name, email, is_admin')
    .eq('id', userId)
    .single();

  console.log('[AUTH DEBUG] Profile query result:', { profile, error: error ? { code: error.code, message: error.message, details: error.details } : null });

  if (profile) {
    console.log('[AUTH DEBUG] Profile found, is_admin =', profile.is_admin, typeof profile.is_admin);
    return profile;
  }

  // Profile doesn't exist — auto-create it
  if (error && error.code === 'PGRST116') {
    console.log('[AUTH DEBUG] No profile row found (PGRST116), auto-creating...');
    const { data: newProfile, error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email: userEmail,
        full_name: userMeta.full_name || '',
      })
      .select('username, phone, full_name, email, is_admin')
      .single();

    console.log('[AUTH DEBUG] Insert result:', { newProfile, insertError });
    return newProfile;
  }

  // If the select failed for another reason (e.g. is_admin column doesn't exist),
  // try without is_admin
  console.log('[AUTH DEBUG] First query failed with non-PGRST116 error, trying fallback without is_admin...');
  const { data: fallbackProfile, error: fallbackError } = await supabase
    .from('profiles')
    .select('username, phone, full_name, email')
    .eq('id', userId)
    .single();

  console.log('[AUTH DEBUG] Fallback result:', { fallbackProfile, fallbackError });

  if (fallbackProfile) {
    return { ...fallbackProfile, is_admin: false };
  }

  console.log('[AUTH DEBUG] No profile found at all, returning null');
  return null;
}

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAppStore(state => state.setUser);
  const setIsLoading = useAppStore(state => state.setIsLoading);

  useEffect(() => {
    setIsLoading(true);
    let initialLoaded = false;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        if (session?.user) {
          const profile = await fetchOrCreateProfile(
            session.user.id,
            session.user.email || '',
            (session.user.user_metadata || {}) as Record<string, string>,
          );

          setUser({
            id: session.user.id,
            name: profile?.full_name || session.user.user_metadata.full_name || '',
            email: profile?.email || session.user.email || '',
            phone: profile?.phone || session.user.phone || '',
            username: profile?.username || session.user.user_metadata.username || '',
            is_admin: profile?.is_admin || false,
          });
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('[AUTH DEBUG] Error in auth state change:', err);
        setUser(null);
      } finally {
        if (!initialLoaded) {
          initialLoaded = true;
          setIsLoading(false);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setIsLoading]);

  return <>{children}</>;
}
