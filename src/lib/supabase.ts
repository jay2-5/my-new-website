import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create a mock client when environment variables are missing
const createSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables not found. Using mock client.')
    return null
  }
  return createClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = createSupabaseClient()

// Types for the consultations table
export interface ConsultationData {
  id?: string
  name: string
  business_name?: string
  email: string
  interested_services: string[]
  other_service?: string
  problems: string
  description?: string
  created_at?: string
  updated_at?: string
}

// Function to submit consultation form data
export async function submitConsultation(data: Omit<ConsultationData, 'id' | 'created_at' | 'updated_at'>) {
  if (!supabase) {
    throw new Error('Supabase is not configured. Please set up your environment variables.')
  }

  const { data: result, error } = await supabase
    .from('consultations')
    .insert([data])
    .select()
    .single()

  if (error) {
    console.error('Supabase error:', error)
    throw new Error(`Failed to submit consultation: ${error.message}`)
  }

  return result
}

// Function to get all consultations (for admin use)
export async function getConsultations() {
  if (!supabase) {
    throw new Error('Supabase is not configured. Please set up your environment variables.')
  }

  const { data, error } = await supabase
    .from('consultations')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Supabase error:', error)
    throw new Error(`Failed to fetch consultations: ${error.message}`)
  }

  return data
}

// Function to get consultation by ID
export async function getConsultationById(id: string) {
  if (!supabase) {
    throw new Error('Supabase is not configured. Please set up your environment variables.')
  }

  const { data, error } = await supabase
    .from('consultations')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Supabase error:', error)
    throw new Error(`Failed to fetch consultation: ${error.message}`)
  }

  return data
}