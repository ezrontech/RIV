import { createBrowserClient } from '@supabase/ssr'
 
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// We allow empty strings during build time to prevent crashes during static generation.
// The actual values will be injected from the environment at runtime or during the final build step.
export const supabase = createBrowserClient(
  supabaseUrl,
  supabaseKey
)
