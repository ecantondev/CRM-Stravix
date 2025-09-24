/*
  # Create activities table

  1. New Tables
    - `activities`
      - `id` (uuid, primary key)
      - `lead_id` (uuid, references leads, optional)
      - `company_id` (uuid, references companies, optional)
      - `deal_id` (uuid, references deals, optional)
      - `contact_id` (uuid, references contacts, optional)
      - `user_id` (uuid, references users)
      - `type` (enum: NOTE, CALL, EMAIL, MEETING, STATUS_CHANGE, DEAL_STAGE_CHANGE, TASK_COMPLETED)
      - `subject` (text, optional)
      - `content` (text)
      - `duration` (integer, optional - in minutes)
      - `scheduled_at` (timestamp, optional)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `activities` table
    - Add policy for authenticated users to read all activities
    - Add policy for users to create activities
*/

-- Create enum type
CREATE TYPE activity_type AS ENUM ('NOTE', 'CALL', 'EMAIL', 'MEETING', 'STATUS_CHANGE', 'DEAL_STAGE_CHANGE', 'TASK_COMPLETED');

-- Create activities table
CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES leads(id),
  company_id uuid REFERENCES companies(id),
  deal_id uuid REFERENCES deals(id),
  contact_id uuid REFERENCES contacts(id),
  user_id uuid REFERENCES users(id) NOT NULL,
  type activity_type NOT NULL,
  subject text,
  content text NOT NULL,
  duration integer, -- in minutes
  scheduled_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read all activities"
  ON activities
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create activities"
  ON activities
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);