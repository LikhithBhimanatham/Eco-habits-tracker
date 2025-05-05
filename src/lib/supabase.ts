
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Default fallback values for development and testing
const defaultUrl = 'https://your-supabase-project.supabase.co';
const defaultKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvdXItc3VwYWJhc2UtcHJvamVjdCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjg3MzAxNjAwLCJleHAiOjE2ODczMDUyMDB9.example-key';

// Get Supabase URL and key from environment variables or use fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || defaultUrl;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || defaultKey;

// Create Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// Export a flag indicating if we're using the mock client
export const isMockSupabase = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;

// Log warning if using mock client
if (isMockSupabase) {
  console.warn('Using mock Supabase client. Connect to a real Supabase instance for production use.');
}
