/*
  # Create projects table

  1. New Tables
    - `projects`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text, optional)
      - `status` (enum: PLANNING, IN_PROGRESS, ON_HOLD, COMPLETED, CANCELLED)
      - `start_date` (date, optional)
      - `end_date` (date, optional)
      - `budget` (numeric, optional)
      - `currency` (text)
      - `company_id` (uuid, references companies)
      - `deal_id` (uuid, references deals, optional)
      - `manager_id` (uuid, references users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `projects` table
    - Add policy for authenticated users to read all projects
    - Add policy for managers and admins to manage projects
*/

-- Create enum type
CREATE TYPE project_status AS ENUM ('PLANNING', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED');

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  status project_status NOT NULL DEFAULT 'PLANNING',
  start_date date,
  end_date date,
  budget numeric,
  currency text NOT NULL DEFAULT 'USD',
  company_id uuid REFERENCES companies(id) NOT NULL,
  deal_id uuid REFERENCES deals(id),
  manager_id uuid REFERENCES users(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read all projects"
  ON projects
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Managers and admins can manage projects"
  ON projects
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND (role = 'ADMIN' OR role = 'MANAGER')
    )
    OR auth.uid() = manager_id
  );

-- Create updated_at trigger
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();