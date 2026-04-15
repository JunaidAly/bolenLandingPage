import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/**
 * Optional Supabase client. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.
 * Table `waitlist`: id uuid default gen_random_uuid(), email text unique, created_at timestamptz default now()
 * Enable INSERT for anon role in Supabase dashboard (RLS policy).
 */
export const supabase: SupabaseClient | null =
  url && anon && url.length > 0 && anon.length > 0 ? createClient(url, anon) : null;
