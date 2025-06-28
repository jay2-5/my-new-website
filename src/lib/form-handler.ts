/**
 * Form Handler for Consultation Submissions
 * Handles form data with Supabase integration
 */

import { supabase, type ConsultationRow, type ConsultationInsert } from './supabase'

export interface ConsultationData {
  id?: string
  name: string
  business_name?: string
  email: string
  interested_services: string[]
  other_service?: string
  problems: string
  description?: string
  status?: 'pending' | 'contacted' | 'scheduled' | 'completed' | 'cancelled'
  created_at?: string
  updated_at?: string
}

/**
 * Submit consultation form data to Supabase
 */
export async function submitConsultation(data: Omit<ConsultationData, 'id' | 'created_at' | 'updated_at'>): Promise<ConsultationData> {
  try {
    // Validate required fields
    if (!data.name?.trim()) {
      throw new Error('Name is required')
    }
    if (!data.email?.trim()) {
      throw new Error('Email is required')
    }
    if (!data.interested_services?.length) {
      throw new Error('At least one service must be selected')
    }
    if (!data.problems?.trim()) {
      throw new Error('Problems description is required')
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      throw new Error('Please enter a valid email address')
    }

    // Validate "others" service requirement
    if (data.interested_services.includes('others') && !data.other_service?.trim()) {
      throw new Error('Please describe the specific service you need when selecting "Others"')
    }

    // Prepare data for insertion
    const insertData: ConsultationInsert = {
      name: data.name.trim(),
      business_name: data.business_name?.trim() || null,
      email: data.email.trim().toLowerCase(),
      interested_services: data.interested_services,
      other_service: data.interested_services.includes('others') ? data.other_service?.trim() || null : null,
      problems: data.problems.trim(),
      description: data.description?.trim() || null,
      status: 'pending'
    }

    // Insert into Supabase
    const { data: result, error } = await supabase
      .from('consultations')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      
      // Handle specific database errors
      if (error.code === '23505') {
        throw new Error('A consultation with this email was already submitted recently')
      } else if (error.code === '23514') {
        throw new Error('Please check that all required fields are filled correctly')
      } else {
        throw new Error('Failed to submit consultation. Please try again.')
      }
    }

    if (!result) {
      throw new Error('No data returned from submission')
    }

    console.log('Consultation submitted successfully:', result.id)
    
    return result as ConsultationData

  } catch (error) {
    console.error('Consultation submission error:', error)
    
    // Re-throw with user-friendly message
    if (error instanceof Error) {
      throw error
    } else {
      throw new Error('An unexpected error occurred. Please try again.')
    }
  }
}

/**
 * Get all consultations (for admin use)
 */
export async function getConsultations(limit: number = 50, offset: number = 0): Promise<ConsultationData[]> {
  try {
    const { data, error } = await supabase
      .from('consultations')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching consultations:', error)
      throw new Error('Failed to fetch consultations')
    }

    return data as ConsultationData[]
  } catch (error) {
    console.error('Get consultations error:', error)
    throw error
  }
}

/**
 * Get consultation by ID
 */
export async function getConsultationById(id: string): Promise<ConsultationData | null> {
  try {
    const { data, error } = await supabase
      .from('consultations')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Not found
      }
      console.error('Error fetching consultation:', error)
      throw new Error('Failed to fetch consultation')
    }

    return data as ConsultationData
  } catch (error) {
    console.error('Get consultation by ID error:', error)
    throw error
  }
}

/**
 * Update consultation status (for admin use)
 */
export async function updateConsultationStatus(
  id: string, 
  status: 'pending' | 'contacted' | 'scheduled' | 'completed' | 'cancelled'
): Promise<ConsultationData> {
  try {
    const { data, error } = await supabase
      .from('consultations')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating consultation status:', error)
      throw new Error('Failed to update consultation status')
    }

    return data as ConsultationData
  } catch (error) {
    console.error('Update consultation status error:', error)
    throw error
  }
}

/**
 * Get consultations by email (for checking duplicates)
 */
export async function getConsultationsByEmail(email: string): Promise<ConsultationData[]> {
  try {
    const { data, error } = await supabase
      .from('consultations')
      .select('*')
      .eq('email', email.toLowerCase())
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching consultations by email:', error)
      throw new Error('Failed to fetch consultations')
    }

    return data as ConsultationData[]
  } catch (error) {
    console.error('Get consultations by email error:', error)
    throw error
  }
}

/**
 * Get consultation statistics (for admin dashboard)
 */
export async function getConsultationStats(): Promise<{
  total: number
  pending: number
  contacted: number
  scheduled: number
  completed: number
  cancelled: number
}> {
  try {
    const { data, error } = await supabase
      .from('consultations')
      .select('status')

    if (error) {
      console.error('Error fetching consultation stats:', error)
      throw new Error('Failed to fetch consultation statistics')
    }

    const stats = {
      total: data.length,
      pending: 0,
      contacted: 0,
      scheduled: 0,
      completed: 0,
      cancelled: 0
    }

    data.forEach(consultation => {
      stats[consultation.status as keyof typeof stats]++
    })

    return stats
  } catch (error) {
    console.error('Get consultation stats error:', error)
    throw error
  }
}