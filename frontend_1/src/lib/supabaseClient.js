import { createClient } from '@supabase/supabase-js';

// Supabase configuration – read from Vite environment variables.
// Fallback to empty strings for a safe development build.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const createMockAuth = (originalAuth = {}) => ({
  ...originalAuth,
  signInWithOtp: async () => ({ user: { id: 'mock-user', email: 'demo@cxo.com' }, error: null }),
  signInWithOAuth: async () => ({ data: { url: '#' }, error: null }),
  getSession: async () => ({ 
    data: { 
      session: { 
        user: { id: 'mock-user', email: 'demo@cxo.com', user_metadata: { role: 'company' } },
        access_token: 'mock-token',
        expires_at: Math.floor(Date.now() / 1000) + 3600
      } 
    }, 
    error: null 
  }),
  onAuthStateChange: (callback) => {
    // Immediately trigger callback with mock session
    callback('SIGNED_IN', { 
      user: { id: 'mock-user', email: 'demo@cxo.com', user_metadata: { role: 'company' } },
      access_token: 'mock-token'
    });
    return { data: { subscription: { unsubscribe: () => {} } } };
  },
  signOut: async () => ({ error: null }),
});

let supabase;
if (supabaseUrl && supabaseAnonKey) {
  const client = createClient(supabaseUrl, supabaseAnonKey);
  // Wrap the real client's auth with our mock auth for temporary access
  supabase = {
    ...client,
    auth: createMockAuth(client.auth)
  };
} else {
  console.warn('Supabase environment variables not set – using mock client');
  supabase = {
    from: () => ({ 
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: [], error: null }),
      update: () => ({ data: [], error: null }),
      delete: () => ({ data: [], error: null }),
      eq: () => ({ data: [], error: null }),
      single: () => ({ data: null, error: null }),
    }),
    storage: {
      from: () => ({
        upload: async () => ({}),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
      }),
    },
    auth: createMockAuth(),
  };
}

export { supabase };
