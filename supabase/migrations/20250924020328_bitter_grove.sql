/*
  # Configuración simple de usuarios sin triggers complejos

  1. Limpieza completa del sistema
  2. Configuración básica de usuarios
  3. Políticas RLS simples
  4. Sin triggers automáticos (para evitar errores)
*/

-- Limpiar todo el sistema de usuarios existente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP TRIGGER IF EXISTS on_auth_user_login ON auth.users CASCADE;
DROP TRIGGER IF EXISTS on_admin_first_login ON auth.users CASCADE;
DROP TRIGGER IF EXISTS on_auth_user_created_admin ON auth.users CASCADE;

DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS update_last_login() CASCADE;
DROP FUNCTION IF EXISTS handle_admin_first_login() CASCADE;
DROP FUNCTION IF EXISTS ensure_first_admin() CASCADE;
DROP FUNCTION IF EXISTS create_user_profile(text, text, user_role, text) CASCADE;

-- Limpiar políticas
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Allow user registration" ON users;
DROP POLICY IF EXISTS "Admins can manage all users" ON users;
DROP POLICY IF EXISTS "Users can read all users for system functionality" ON users;
DROP POLICY IF EXISTS "Users can read own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Allow user registration" ON users;
DROP POLICY IF EXISTS "Admin can manage all users" ON users;

-- Crear políticas RLS muy simples
CREATE POLICY "Allow all operations for authenticated users"
  ON users
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Función simple para crear usuarios manualmente
CREATE OR REPLACE FUNCTION create_user_manually(
  p_email text,
  p_name text,
  p_role user_role DEFAULT 'SALES',
  p_department text DEFAULT NULL
)
RETURNS uuid
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Generar nuevo ID
  new_user_id := gen_random_uuid();
  
  -- Insertar usuario
  INSERT INTO users (
    id,
    email,
    name,
    role,
    status,
    department,
    created_at,
    updated_at
  ) VALUES (
    new_user_id,
    p_email,
    p_name,
    p_role,
    'ACTIVE',
    p_department,
    NOW(),
    NOW()
  );
  
  RETURN new_user_id;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error creating user: %', SQLERRM;
END;
$$;

-- Insertar usuario admin por defecto si no existe
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@stravix.io') THEN
    INSERT INTO users (
      id,
      email,
      name,
      role,
      status,
      created_at,
      updated_at
    ) VALUES (
      gen_random_uuid(),
      'admin@stravix.io',
      'Administrador',
      'ADMIN',
      'ACTIVE',
      NOW(),
      NOW()
    );
  END IF;
END $$;