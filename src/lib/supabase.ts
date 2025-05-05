
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Default fallback values for development
const defaultUrl = 'https://your-supabase-project.supabase.co';
const defaultKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvdXItc3VwYWJhc2UtcHJvamVjdCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjg3MzAxNjAwLCJleHAiOjE2ODczMDUyMDB9.example-key';

// Get Supabase URL and key from environment variables or use fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || defaultUrl;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || defaultKey;

// Create Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// Export a mock version for environments without Supabase setup
export const isMockSupabase = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;

