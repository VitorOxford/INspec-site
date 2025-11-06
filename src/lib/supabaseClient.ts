// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

// Pegue estes valores do seu painel Supabase em Settings > API
const supabaseUrl = 'https://tepxardlrnsjitcgndpt.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlcHhhcmRscm5zaml0Y2duZHB0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjI3Mjc5OCwiZXhwIjoyMDc3ODQ4Nzk4fQ.9YvM9rzGWINXnDU1Jg47I53P7T47ujBBL-8TRe8JAMc'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL ou Anon Key não estão definidos.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)