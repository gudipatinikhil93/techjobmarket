import { createClient } from '@supabase/supabase-js';

// Helper to get env var from multiple possible sources
function getEnv(key: string): string | undefined {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  // @ts-ignore - import.meta.env is Astro/Vite specific
  if (import.meta.env && import.meta.env[key]) {
    return import.meta.env[key];
  }
  return undefined;
}

const supabaseUrl = getEnv('SUPABASE_URL');
const supabaseAnonKey = getEnv('SUPABASE_ANON_KEY');
const supabaseServiceKey = getEnv('SUPABASE_SERVICE_ROLE_KEY');

// Use Service Role Key for backend if available, otherwise fallback to Anon Key
const activeKey = supabaseServiceKey || supabaseAnonKey;

if (!supabaseUrl || !activeKey) {
  console.warn('--- WARNING: Supabase credentials are missing ---');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  activeKey || 'placeholder'
);

