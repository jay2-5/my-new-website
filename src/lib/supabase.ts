/**
 * Supabase Client Configuration
 * Handles database connections and operations
 */

import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Database types for TypeScript
export interface Database {
  public: {
    Tables: {
      consultations: {
        Row: {
          id: string
          name: string
          business_name: string | null
          email: string
          interested_services: string[]
          other_service: string | null
          problems: string
          description: string | null
          status: 'pending' | 'contacted' | 'scheduled' | 'completed' | 'cancelled'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          business_name?: string | null
          email: string
          interested_services: string[]
          other_service?: string | null
          problems: string
          description?: string | null
          status?: 'pending' | 'contacted' | 'scheduled' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          business_name?: string | null
          email?: string
          interested_services?: string[]
          other_service?: string | null
          problems?: string
          description?: string | null
          status?: 'pending' | 'contacted' | 'scheduled' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

// Type-safe Supabase client
export type SupabaseClient = typeof supabase
export type ConsultationRow = Database['public']['Tables']['consultations']['Row']
export type ConsultationInsert = Database['public']['Tables']['consultations']['Insert']
export type ConsultationUpdate = Database['public']['Tables']['consultations']['Update']