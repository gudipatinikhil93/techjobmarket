import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || import.meta.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials are missing. Ensure SUPABASE_URL and SUPABASE_ANON_KEY are set.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
