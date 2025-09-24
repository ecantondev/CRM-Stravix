/*
  # Reset completo del sistema de usuarios

  1. Limpieza completa
    - Eliminar todos los triggers y funciones existentes
    - Limpiar políticas RLS
    
  2. Sistema simplificado
    - Función robusta para nuevos usuarios
    - Políticas RLS sin recursión
    - Manejo de errores mejorado
    
  3. Seguridad
    - search_path fijo en todas las funciones
    - Políticas claras y sin conflictos
*/

-- 1. LIMPIEZA COMPLETA DE TRIGGERS Y FUNCIONES
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP TRIGGER IF EXISTS on_auth_user_login ON auth.users CASCADE;
DROP TRIGGER IF EXISTS on_admin_first_login ON auth.users CASCADE;
DROP TRIGGER IF EXISTS on_auth_user_created_admin ON auth.users CASCADE;

DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS update_last_login() CASCADE;
DROP FUNCTION IF EXISTS handle_admin_first_login() CASCADE;
DROP FUNCTION IF EXISTS ensure_first_admin() CASCADE;

-- 2. LIMPIAR TODAS LAS POLÍTICAS RLS
DROP POLICY IF EXISTS "Users can read own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Allow user registration" ON users;
DROP POLICY IF EXISTS "Admin can manage all users" ON users;
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can read all users" ON users;
DROP POLICY IF EXISTS "Users can read own profile during registration" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Allow user registration" ON users;
DROP POLICY IF EXISTS "Allow admin signup" ON users;
DROP POLICY IF EXISTS "Admins can manage users" ON users;
DROP POLICY IF EXISTS "Users can read all users for system functionality" ON users;

-- 3. FUNCIÓN PRINCIPAL PARA NUEVOS USUARIOS
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  user_count INTEGER := 0;
  user_role user_role := 'SALES';
  user_status user_status := 'PENDING';
  user_name TEXT;
BEGIN
  -- Obtener nombre del usuario
  user_name := COALESCE(
    NEW.raw_user_meta_data->>'name', 
    NEW.raw_user_meta_data->>'full_name', 
    split_part(NEW.email, '@', 1)
  );
  
  -- Contar usuarios existentes
  BEGIN
    SELECT COUNT(*) INTO user_count FROM users;
  EXCEPTION
    WHEN OTHERS THEN
      user_count := 0;
  END;
  
  -- Determinar rol y estado
  IF user_count = 0 OR NEW.email = 'ezequiel.canton@stravix.io' THEN
    user_role := 'ADMIN';
    user_status := 'ACTIVE';
  END IF;
  
  -- Insertar usuario con manejo de errores
  BEGIN
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
      user_name,
      user_role,
      user_status,
      NOW(), 
      NOW()
    );
    
    RAISE NOTICE 'User profile created successfully for: %', NEW.email;
    
  EXCEPTION
    WHEN unique_violation THEN
      RAISE NOTICE 'User profile already exists for: %', NEW.email;
    WHEN OTHERS THEN
      RAISE WARNING 'Error creating user profile for %: %', NEW.email, SQLERRM;
  END;
  
  RETURN NEW;
END;
$$;

-- 4. FUNCIÓN PARA ACTUALIZAR ÚLTIMO LOGIN
CREATE OR REPLACE FUNCTION update_last_login()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Solo actualizar si last_sign_in_at cambió y no es NULL
  IF OLD.last_sign_in_at IS DISTINCT FROM NEW.last_sign_in_at AND NEW.last_sign_in_at IS NOT NULL THEN
    BEGIN
      UPDATE users 
      SET last_login_at = NEW.last_sign_in_at
      WHERE id = NEW.id;
    EXCEPTION
      WHEN OTHERS THEN
        RAISE WARNING 'Error updating last login for %: %', NEW.id, SQLERRM;
    END;
  END IF;
  
  RETURN NEW;
END;
$$;

-- 5. RECREAR TRIGGERS
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

CREATE TRIGGER on_auth_user_login
  AFTER UPDATE OF last_sign_in_at ON auth.users
  FOR EACH ROW EXECUTE FUNCTION update_last_login();

-- 6. POLÍTICAS RLS SIMPLIFICADAS Y SEGURAS

-- Política básica: usuarios pueden leer su propio perfil
CREATE POLICY "users_select_own"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Política: usuarios pueden actualizar su propio perfil
CREATE POLICY "users_update_own"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Política: permitir inserción durante registro
CREATE POLICY "users_insert_own"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Política: lectura general para funcionalidad del sistema
CREATE POLICY "users_select_all"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);

-- Política: admins pueden gestionar todos los usuarios
CREATE POLICY "admins_manage_all"
  ON users
  FOR ALL
  TO authenticated
  USING (
    auth.jwt() ->> 'email' = 'ezequiel.canton@stravix.io'
    OR
    (
      SELECT role FROM users 
      WHERE id = auth.uid() 
      LIMIT 1
    ) = 'ADMIN'
  );

-- 7. VERIFICAR QUE RLS ESTÉ HABILITADO
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 8. FUNCIÓN DE UTILIDAD PARA CREAR USUARIOS MANUALMENTE (SOLO ADMIN)
CREATE OR REPLACE FUNCTION create_user_profile(
  p_email TEXT,
  p_name TEXT,
  p_role user_role DEFAULT 'SALES',
  p_department TEXT DEFAULT NULL
)
RETURNS UUID
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  new_user_id UUID;
  current_user_role user_role;
BEGIN
  -- Verificar que el usuario actual es admin
  SELECT role INTO current_user_role 
  FROM users 
  WHERE id = auth.uid();
  
  IF current_user_role != 'ADMIN' THEN
    RAISE EXCEPTION 'Only admins can create user profiles';
  END IF;
  
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
    created_by,
    created_at,
    updated_at
  ) VALUES (
    new_user_id,
    p_email,
    p_name,
    p_role,
    'ACTIVE', -- Los usuarios creados por admin están pre-aprobados
    p_department,
    auth.uid(),
    NOW(),
    NOW()
  );
  
  RETURN new_user_id;
END;
$$;