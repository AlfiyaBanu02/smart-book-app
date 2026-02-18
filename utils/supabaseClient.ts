// utils/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

// Using environment variables for safety
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
export const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
export const supabase = createClient(supabaseUrl, supabaseKey)
