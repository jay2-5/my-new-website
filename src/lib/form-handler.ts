/**
 * Form Handler for Consultation Submissions
 * Handles form data without external dependencies
 */

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
}

/**
 * Submit consultation form data
 * This is a mock implementation that simulates form submission
 */
export async function submitConsultation(data: Omit<ConsultationData, 'id' | 'created_at'>): Promise<ConsultationData> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Create a mock response
  const result: ConsultationData = {
    id: generateId(),
    ...data,
    created_at: new Date().toISOString()
  };
  
  // Log the submission (in a real app, this would be sent to your backend)
  console.log('Consultation submitted:', result);
  
  // Store in localStorage for demo purposes
  const existingSubmissions = getStoredSubmissions();
  existingSubmissions.push(result);
  localStorage.setItem('consultations', JSON.stringify(existingSubmissions));
  
  return result;
}

/**
 * Get all stored consultations (for demo purposes)
 */
export function getConsultations(): ConsultationData[] {
  return getStoredSubmissions();
}

/**
 * Get consultation by ID (for demo purposes)
 */
export function getConsultationById(id: string): ConsultationData | null {
  const submissions = getStoredSubmissions();
  return submissions.find(submission => submission.id === id) || null;
}

/**
 * Helper function to generate a simple ID
 */
function generateId(): string {
  return 'consultation_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Helper function to get stored submissions from localStorage
 */
function getStoredSubmissions(): ConsultationData[] {
  try {
    const stored = localStorage.getItem('consultations');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading stored consultations:', error);
    return [];
  }
}