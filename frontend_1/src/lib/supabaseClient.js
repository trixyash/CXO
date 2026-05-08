import { createClient } from '@supabase/supabase-js';

// Supabase configuration – read from Vite environment variables.
// Fallback to empty strings for a safe development build.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabase;
if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn('Supabase environment variables not set – using mock client');
  // Minimal mock implementation to avoid runtime crashes during development.
  supabase = {
    from: () => ({ select: () => ({ data: [], error: null }) }),
    storage: {
      from: () => ({
        upload: async () => ({}),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
      }),
    },
    auth: { 
      signInWithOtp: async () => ({ user: null, error: null }),
      signInWithOAuth: async () => ({ data: null, error: new Error('Supabase is not configured') })
    },
  };
}

export { supabase };
