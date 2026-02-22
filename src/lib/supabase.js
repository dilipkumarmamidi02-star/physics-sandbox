import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jkirrwlfmuvucysuxkid.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpraXJyd2xmbXV2dWN5c3V4a2lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2OTQxNzIsImV4cCI6MjA4NzI3MDE3Mn0.ghqEoEJZ8OP9uoJ9KiEDIyXxYxieY9PZ9KhE3q4--PY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storageKey: 'phx-auth',
    detectSessionInUrl: false
  }
})
