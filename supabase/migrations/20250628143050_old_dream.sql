/*
  # Create consultations table

  1. New Tables
    - `consultations`
      - `id` (uuid, primary key)
      - `name` (text, required) - User's full name
      - `business_name` (text, optional) - Business or company name
      - `email` (text, required) - Contact email address
      - `interested_services` (text array) - Selected services from the form
      - `other_service` (text, optional) - Custom service description when "others" is selected
      - `problems` (text, required) - Description of problems to solve
      - `description` (text, optional) - Additional project description
      - `created_at` (timestamp) - When the consultation was submitted
      - `updated_at` (timestamp) - Last update timestamp

  2. Security
    - Enable RLS on `consultations` table
    - Add policy for public insert access (form submissions)
    - Add policy for authenticated users to read their own data

  3. Indexes
    - Index on email for faster lookups
    - Index on created_at for chronological queries
*/

-- Create the consultations table
CREATE TABLE IF NOT EXISTS consultations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (length(trim(name)) >= 2 AND length(trim(name)) <= 50),
  business_name text CHECK (business_name IS NULL OR length(trim(business_name)) <= 100),
  email text NOT NULL CHECK (email ~* '^[^\s@]+@[^\s@]+\.[^\s@]+$' AND length(email) <= 100),
  interested_services text[] NOT NULL CHECK (array_length(interested_services, 1) >= 1 AND array_length(interested_services, 1) <= 5),
  other_service text CHECK (other_service IS NULL OR (length(trim(other_service)) >= 10 AND length(trim(other_service)) <= 200)),
  problems text NOT NULL CHECK (length(trim(problems)) >= 30 AND length(trim(problems)) <= 1000),
  description text CHECK (description IS NULL OR length(description) <= 2000),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Anyone can submit consultations" ON consultations;
DROP POLICY IF EXISTS "Authenticated users can read consultations" ON consultations;
DROP POLICY IF EXISTS "Allow anonymous consultation submissions" ON consultations;

-- Create policy for public insert access (anyone can submit a consultation)
CREATE POLICY "Allow anonymous consultation submissions"
  ON consultations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create policy for authenticated users to read all consultations (for admin access)
CREATE POLICY "Authenticated users can read consultations"
  ON consultations
  FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS consultations_email_idx ON consultations (email);
CREATE INDEX IF NOT EXISTS consultations_created_at_idx ON consultations (created_at DESC);
CREATE INDEX IF NOT EXISTS consultations_interested_services_idx ON consultations USING GIN (interested_services);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_consultations_updated_at ON consultations;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_consultations_updated_at
  BEFORE UPDATE ON consultations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add helpful comments
COMMENT ON TABLE consultations IS 'Stores consultation requests from the website contact form';
COMMENT ON COLUMN consultations.name IS 'Full name of the person requesting consultation';
COMMENT ON COLUMN consultations.business_name IS 'Optional business or company name';
COMMENT ON COLUMN consultations.email IS 'Contact email address for follow-up';
COMMENT ON COLUMN consultations.interested_services IS 'Array of selected services from the form';
COMMENT ON COLUMN consultations.other_service IS 'Custom service description when "others" is selected';
COMMENT ON COLUMN consultations.problems IS 'Description of business problems or processes to automate';
COMMENT ON COLUMN consultations.description IS 'Additional project details and requirements';