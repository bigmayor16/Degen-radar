import { createClient } from '@supabase/supabase-js';

// SERVER-ONLY. This uses the Supabase service role key, which bypasses
// Row Level Security. It must never be imported into a client component
// or anything with 'use client' at the top — only into files under
// app/api/, which run exclusively on the server and are never sent to
// the browser. The service role key itself must be set in Vercel as a
// Secret-type variable WITHOUT the NEXT_PUBLIC_ prefix.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
