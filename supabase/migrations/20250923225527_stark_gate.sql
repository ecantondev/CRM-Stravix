/*
  # Create contacts table

  1. New Tables
    - `contacts`
      - `id` (uuid, primary key)
      - `first_name` (text)
      - `last_name` (text)
      - `email` (text, optional)
      - `phone` (text, optional)
      - `position` (text, optional)
      - `department` (text, optional)
      - `company_id` (uuid, references companies, optional)
      - `lead_id` (uuid, references leads, optional)
      - `is_primary` (boolean)
      - `linkedin_url` (text, optional)
      - `notes` (text, optional)
      - `owner_id` (uuid, references users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `contacts` table
    - Add policy for authenticated users to read all contacts
    - Add policy for users to manage their own contacts
*/

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text,
  phone text,
  position text,
  department text,
  company_id uuid REFERENCES companies(id),
  lead_id uuid REFERENCES leads(id),
  is_primary boolean NOT NULL DEFAULT false,
  linkedin_url text,
  notes text,
  owner_id uuid REFERENCES users(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read all contacts"
  ON contacts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage their own contacts"
  ON contacts
  FOR ALL
  TO authenticated
  USING (auth.uid() = owner_id);

-- Create updated_at trigger
CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();