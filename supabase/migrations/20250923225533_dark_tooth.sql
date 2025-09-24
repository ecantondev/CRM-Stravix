/*
  # Create deals table

  1. New Tables
    - `deals`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text, optional)
      - `value` (numeric)
      - `currency` (text)
      - `probability` (integer)
      - `stage` (enum: PROSPECTING, QUALIFICATION, PROPOSAL, NEGOTIATION, CLOSED_WON, CLOSED_LOST)
      - `expected_close_date` (date, optional)
      - `actual_close_date` (date, optional)
      - `company_id` (uuid, references companies, optional)
      - `lead_id` (uuid, references leads, optional)
      - `owner_id` (uuid, references users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `deals` table
    - Add policy for authenticated users to read all deals
    - Add policy for users to manage their own deals
*/

-- Create enum type
CREATE TYPE deal_stage AS ENUM ('PROSPECTING', 'QUALIFICATION', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST');

-- Create deals table
CREATE TABLE IF NOT EXISTS deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  value numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  probability integer NOT NULL DEFAULT 0 CHECK (probability >= 0 AND probability <= 100),
  stage deal_stage NOT NULL DEFAULT 'PROSPECTING',
  expected_close_date date,
  actual_close_date date,
  company_id uuid REFERENCES companies(id),
  lead_id uuid REFERENCES leads(id),
  owner_id uuid REFERENCES users(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read all deals"
  ON deals
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage their own deals"
  ON deals
  FOR ALL
  TO authenticated
  USING (auth.uid() = owner_id);

-- Create updated_at trigger
CREATE TRIGGER update_deals_updated_at
  BEFORE UPDATE ON deals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();