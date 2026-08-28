import { createClient } from '@supabase/supabase-js';

// Clean up and validate environment variables
let rawUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
rawUrl = rawUrl.replace('YOUR_SUPABASE_PRO', '').replace('YOUR_SUPABASE_PROJECT_ID', '').trim();

const isValidUrl = rawUrl.startsWith('http://') || rawUrl.startsWith('https://');
const supabaseUrl = isValidUrl ? rawUrl : 'https://placeholder.supabase.co';
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim() || 'placeholder-key';

export const isSupabaseConfigured = 
  isValidUrl && 
  !supabaseUrl.includes('placeholder') && 
  Boolean(supabaseAnonKey) && 
  supabaseAnonKey !== 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
