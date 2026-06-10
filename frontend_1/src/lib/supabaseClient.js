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

const createSupabaseClient = () => {
  const isMockAuth = typeof window !== 'undefined' && localStorage.getItem('sb-mock-auth') === 'true';

  if (supabaseUrl && supabaseAnonKey && !isMockAuth) {
    return createClient(supabaseUrl, supabaseAnonKey);
  } else {
    if (isMockAuth) {
      console.info('Mock authentication enabled via localStorage flag');
    } else {
      console.warn('Supabase environment variables not set – using mock client');
    }
    const chainableMock = {
      select: () => chainableMock,
      insert: () => chainableMock,
      update: () => chainableMock,
      delete: () => chainableMock,
      eq: () => chainableMock,
      single: async () => ({ data: null, error: null }),
      maybeSingle: async () => ({ data: null, error: null }),
      limit: () => chainableMock,
      order: () => chainableMock,
      then: (resolve) => resolve({ data: null, error: null })
    };
    const mockChannel = {
      on: () => mockChannel,
      subscribe: (callback) => {
        if (callback) callback("SUBSCRIBED");
        return mockChannel;
      },
    };
    return {
      from: () => chainableMock,
      storage: {
        from: () => ({
          upload: async () => ({}),
          getPublicUrl: () => ({ data: { publicUrl: '' } }),
        }),
      },
      auth: createMockAuth(),
      channel: () => mockChannel,
      removeChannel: () => {},
    };
  }
};

export const supabase = createSupabaseClient();
