/*
  # Create tasks table

  1. New Tables
    - `tasks`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text, optional)
      - `lead_id` (uuid, references leads, optional)
      - `assigned_to` (uuid, references users)
      - `created_by` (uuid, references users)
      - `status` (enum: PENDING, IN_PROGRESS, COMPLETED, CANCELLED)
      - `priority` (enum: LOW, MEDIUM, HIGH, URGENT)
      - `due_date` (timestamp, optional)
      - `completed_at` (timestamp, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `tasks` table
    - Add policy for authenticated users to read all tasks
    - Add policy for users to manage tasks assigned to them or created by them
*/

-- Create enum types
CREATE TYPE task_status AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
CREATE TYPE task_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  lead_id uuid REFERENCES leads(id),
  assigned_to uuid REFERENCES users(id) NOT NULL,
  created_by uuid REFERENCES users(id) NOT NULL,
  status task_status NOT NULL DEFAULT 'PENDING',
  priority task_priority NOT NULL DEFAULT 'MEDIUM',
  due_date timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read all tasks"
  ON tasks
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage their assigned or created tasks"
  ON tasks
  FOR ALL
  TO authenticated
  USING (
    auth.uid() = assigned_to OR 
    auth.uid() = created_by OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND (role = 'ADMIN' OR role = 'MANAGER')
    )
  );

-- Create updated_at trigger
CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();