import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Use placeholders to prevent the "supabaseUrl is required" crash on startup
// if the environment variables are not yet configured.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-please-set-your-url.supabase.co',
  supabaseAnonKey || 'placeholder-please-set-your-key'
);
