/*
  # Create companies table

  1. New Tables
    - `companies`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `industry` (text)
      - `size` (enum: STARTUP, SMALL, MEDIUM, LARGE, ENTERPRISE)
      - `website` (text, optional)
      - `phone` (text, optional)
      - `email` (text, optional)
      - `address` (text, optional)
      - `city` (text, optional)
      - `country` (text, optional)
      - `description` (text, optional)
      - `logo` (text, optional)
      - `owner_id` (uuid, references users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `companies` table
    - Add policy for authenticated users to read companies
    - Add policy for users to manage their own companies
*/

-- Create enum type
CREATE TYPE company_size AS ENUM ('STARTUP', 'SMALL', 'MEDIUM', 'LARGE', 'ENTERPRISE');

-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  industry text NOT NULL,
  size company_size NOT NULL DEFAULT 'SMALL',
  website text,
  phone text,
  email text,
  address text,
  city text,
  country text,
  description text,
  logo text,
  owner_id uuid REFERENCES users(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read all companies"
  ON companies
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage their own companies"
  ON companies
  FOR ALL
  TO authenticated
  USING (auth.uid() = owner_id);

-- Create updated_at trigger
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();