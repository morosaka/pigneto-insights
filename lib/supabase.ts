// Browser-only Supabase client (anon key, no cookie session).
// For server components or Route Handlers, use lib/supabase-server.ts (to be added).
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(url, key);
