/*
  # Create consultations table for booking form data

  1. New Tables
    - `consultations`
      - `id` (uuid, primary key)
      - `name` (text, required) - User's full name
      - `business_name` (text, optional) - Business/company name
      - `email` (text, required) - Contact email address
      - `interested_services` (text[], required) - Array of selected services
      - `other_service` (text, optional) - Custom service description when "others" selected
      - `problems` (text, required) - Problems/processes to automate description
      - `description` (text, optional) - Additional project details
      - `status` (text, default 'pending') - Consultation status
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `consultations` table
    - Add policy for inserting new consultations (public access for form submissions)
    - Add policy for reading consultations (authenticated users only)
    - Add policy for updating consultation status (authenticated users only)

  3. Indexes
    - Index on email for faster lookups
    - Index on created_at for chronological sorting
    - Index on status for filtering
*/

-- Create consultations table
CREATE TABLE IF NOT EXISTS consultations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (length(trim(name)) >= 2 AND length(trim(name)) <= 100),
  business_name text CHECK (business_name IS NULL OR (length(trim(business_name)) >= 1 AND length(trim(business_name)) <= 100)),
  email text NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  interested_services text[] NOT NULL CHECK (array_length(interested_services, 1) >= 1 AND array_length(interested_services, 1) <= 10),
  other_service text CHECK (other_service IS NULL OR (length(trim(other_service)) >= 10 AND length(trim(other_service)) <= 500)),
  problems text NOT NULL CHECK (length(trim(problems)) >= 30 AND length(trim(problems)) <= 2000),
  description text CHECK (description IS NULL OR length(trim(description)) <= 2000),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'scheduled', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow anyone to insert consultations (for public form submissions)
CREATE POLICY "Anyone can submit consultations"
  ON consultations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow authenticated users to read all consultations
CREATE POLICY "Authenticated users can read consultations"
  ON consultations
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to update consultation status
CREATE POLICY "Authenticated users can update consultations"
  ON consultations
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_consultations_email ON consultations(email);
CREATE INDEX IF NOT EXISTS idx_consultations_created_at ON consultations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_consultations_status ON consultations(status);
CREATE INDEX IF NOT EXISTS idx_consultations_interested_services ON consultations USING GIN(interested_services);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_consultations_updated_at
  BEFORE UPDATE ON consultations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add helpful comments
COMMENT ON TABLE consultations IS 'Stores consultation booking requests from the website form';
COMMENT ON COLUMN consultations.name IS 'Full name of the person requesting consultation';
COMMENT ON COLUMN consultations.business_name IS 'Optional business or company name';
COMMENT ON COLUMN consultations.email IS 'Contact email address for follow-up';
COMMENT ON COLUMN consultations.interested_services IS 'Array of service IDs the user is interested in';
COMMENT ON COLUMN consultations.other_service IS 'Description of custom service when "others" is selected';
COMMENT ON COLUMN consultations.problems IS 'Description of problems or processes to automate';
COMMENT ON COLUMN consultations.description IS 'Additional project details and requirements';
COMMENT ON COLUMN consultations.status IS 'Current status of the consultation request';