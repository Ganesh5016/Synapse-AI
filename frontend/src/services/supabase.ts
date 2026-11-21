import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://sqpxcjgubxfesiimofjn.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxcHhjamd1YnhmZXNpaW1vZmpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIwNDIwMjEsImV4cCI6MjEwNzYxODAyMX0.-Dd3CQPKOHgJV4LBDCQI6mGA-n9cDOUA8QIRwkZ9_SM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export const isSupabaseConfigured = (): boolean => {
  return Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-project-id'));
};
