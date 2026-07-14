import { describe, it, expect } from 'vitest';
import { supabase } from '../supabase';

describe('Supabase Client Configuration', () => {
  it('should initialize supabase client correctly', () => {
    expect(supabase).toBeDefined();
    expect(supabase.auth).toBeDefined();
    expect(supabase.from).toBeDefined();
  });
});
