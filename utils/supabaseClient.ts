import { createClient } from '@supabase/supabase-js'

// 🔹 Replace these with your Supabase project values
const supabaseUrl: string = 'https://tnrdclntgspslpxlpjcm.supabase.co'
const supabaseAnonKey: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRucmRjbG50Z3Nwc2xweGxwamNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyOTUyOTYsImV4cCI6MjA4Njg3MTI5Nn0.4kuWR52MFv2yxFMD-G3bJzjB68QALwtPZ3qEZ0_NM9M'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
