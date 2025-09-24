/*
  # Create leads table

  1. New Tables
    - `leads`
      - `id` (uuid, primary key)
      - `first_name` (text)
      - `last_name` (text)
      - `title` (text)
      - `company` (text)
      - `linkedin_url` (text)
      - `note` (text, optional)
      - `status` (enum: NEW, CONTACTED, IN_CONVERSATION, MEETING, CLOSED)
      - `owner_id` (uuid, references users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `leads` table
    - Add policy for authenticated users to read all leads
    - Add policy for users to manage their own leads
*/

-- Create enum type
CREATE TYPE lead_status AS ENUM ('NEW', 'CONTACTED', 'IN_CONVERSATION', 'MEETING', 'CLOSED');

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  title text NOT NULL,
  company text NOT NULL,
  linkedin_url text NOT NULL,
  note text,
  status lead_status NOT NULL DEFAULT 'NEW',
  owner_id uuid REFERENCES users(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read all leads"
  ON leads
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage their own leads"
  ON leads
  FOR ALL
  TO authenticated
  USING (auth.uid() = owner_id);

-- Create updated_at trigger
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();