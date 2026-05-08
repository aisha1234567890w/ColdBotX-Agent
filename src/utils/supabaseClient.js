import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabaseInstance = null;

if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  supabaseInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
  console.warn('Supabase keys are missing. Backend features will be disabled.');
  // Create a mock object so the app doesn't crash on calls
  supabaseInstance = {
    auth: {
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      getSessionFromUrl: async () => ({ data: { session: null }, error: null }),
      signInWithPassword: async () => ({ data: { user: { email: 'manager@aifur.pk' }, session: {} }, error: null }),
      signUp: async () => ({ data: { user: { email: 'user@example.com' }, session: {} }, error: null }),
      signOut: async () => {},
    }
  };
}

export const supabase = supabaseInstance;
export default supabase;
