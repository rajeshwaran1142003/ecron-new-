
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wwmtucflnalxdnwtcdjy.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3bXR1Y2ZsbmFseGRud3RjZGp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwMzY4MDQsImV4cCI6MjA2OTYxMjgwNH0.JTBOqMjLzlKZn47ZFBLlyALbZGuh95xQs0-tW5eGGNo'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Database {
  public: {
    Tables: {
      event_registrations: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string
          phone: string | null
          organization: string | null
          job_title: string | null
          experience_level: string | null
          interests: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          email: string
          phone?: string | null
          organization?: string | null
          job_title?: string | null
          experience_level?: string | null
          interests?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string
          phone?: string | null
          organization?: string | null
          job_title?: string | null
          experience_level?: string | null
          interests?: string[] | null
          created_at?: string
        }
      }
    }
  }
}
