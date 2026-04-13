import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';

// Cliente para el navegador (solo anon key)
export function createBrowserClient() {
  return createClient(supabaseUrl, supabaseAnonKey);
}

// Cliente para el servidor (service key con privilegios completos)
export function createServerClient() {
  return createClient(supabaseUrl, supabaseServiceKey);
}
