// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

// Pegue estes valores do seu painel Supabase em Settings > API
const supabaseUrl = 'https://tepxardlrnsjitcgndpt.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlcHhhcmRscm5zaml0Y2duZHB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNzI3OTgsImV4cCI6MjA3Nzg0ODc5OH0.SBjwXpU---gBvHVB5gVKSEdmQj2jeiIbKe6hpMBgWvo'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL ou Anon Key não estão definidos.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)