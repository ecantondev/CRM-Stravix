/*
  # Fix Supabase Authentication Integration

  1. Database Functions
    - Create function to handle new user registration
    - Create function to handle admin first login
    - Update existing triggers

  2. Security Policies
    - Add policy for new user registration
    - Update existing RLS policies
    - Allow admin auto-approval

  3. Triggers
    - Auto-create user profile on auth signup
    - Handle admin first login detection
*/

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_count INTEGER;
BEGIN
  -- Count existing users
  SELECT COUNT(*) INTO user_count FROM users;
  
  -- Insert new user profile
  INSERT INTO users (
    id,
    email,
    name,
    role,
    status,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    CASE 
      WHEN user_count = 0 THEN 'ADMIN'::user_role  -- First user becomes admin
      ELSE 'SALES'::user_role  -- Default role for new users
    END,
    CASE 
      WHEN user_count = 0 THEN 'ACTIVE'::user_status  -- First user is auto-approved
      ELSE 'PENDING'::user_status  -- New users need approval
    END,
    now(),
    now()
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle admin first login (auto-approve specific email)
CREATE OR REPLACE FUNCTION handle_admin_first_login()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-approve specific admin email
  IF NEW.email = 'ezequiel.canton@stravix.io' THEN
    UPDATE users 
    SET 
      role = 'ADMIN'::user_role,
      status = 'ACTIVE'::user_status,
      updated_at = now()
    WHERE id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_admin ON auth.users;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create trigger for admin auto-approval
CREATE TRIGGER on_auth_user_created_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_admin_first_login();

-- Update RLS policies to allow user registration
DROP POLICY IF EXISTS "Allow user registration" ON users;
CREATE POLICY "Allow user registration"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Update policy to allow admin signup for specific email
DROP POLICY IF EXISTS "Allow admin signup" ON users;
CREATE POLICY "Allow admin signup"
  ON users
  FOR INSERT
  TO anon
  WITH CHECK (email = 'ezequiel.canton@stravix.io');

-- Ensure users can read their own profile during registration
DROP POLICY IF EXISTS "Users can read own profile during registration" ON users;
CREATE POLICY "Users can read own profile during registration"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR auth.email() = email);