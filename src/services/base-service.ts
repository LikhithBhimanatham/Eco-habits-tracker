
import { supabase, isMockSupabase } from '@/lib/supabase';

// Helper functions
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export const logMockWarning = () => {
  console.warn("Using mock Supabase client. Connect to a real Supabase instance for production use.");
};

export { supabase, isMockSupabase };
