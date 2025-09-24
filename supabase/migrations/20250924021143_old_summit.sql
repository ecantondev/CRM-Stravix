/*
  # Corregir recursión infinita en políticas RLS

  1. Problema
    - Las políticas RLS están causando recursión infinita
    - Error: "infinite recursion detected in policy for relation users"

  2. Solución
    - Eliminar todas las políticas problemáticas
    - Crear políticas simples sin recursión
    - Usar auth.uid() directamente sin consultas a users

  3. Seguridad
    - Mantener RLS habilitado
    - Políticas seguras sin bucles
*/

-- Eliminar TODAS las políticas existentes de users
DROP POLICY IF EXISTS "Users can read own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Allow user registration" ON users;
DROP POLICY IF EXISTS "Admin can manage all users" ON users;
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can read all users" ON users;
DROP POLICY IF EXISTS "Users can read own profile during registration" ON users;
DROP POLICY IF EXISTS "Allow admin signup" ON users;
DROP POLICY IF EXISTS "Admins can manage users" ON users;
DROP POLICY IF EXISTS "users_insert_own" ON users;
DROP POLICY IF EXISTS "users_select_all" ON users;
DROP POLICY IF EXISTS "users_select_own" ON users;
DROP POLICY IF EXISTS "users_update_own" ON users;
DROP POLICY IF EXISTS "admins_manage_all" ON users;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON users;
DROP POLICY IF EXISTS "Users can read all users for system functionality" ON users;

-- Crear políticas simples SIN RECURSIÓN
-- Política 1: Usuarios pueden leer su propio perfil
CREATE POLICY "users_read_own"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Política 2: Usuarios pueden actualizar su propio perfil
CREATE POLICY "users_update_own"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Política 3: Permitir inserción durante registro
CREATE POLICY "users_insert_during_registration"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Política 4: Admin especial (usando email directo, sin consulta recursiva)
CREATE POLICY "admin_full_access"
  ON users
  FOR ALL
  TO authenticated
  USING (
    (auth.jwt() ->> 'email') = 'ezequiel.canton@stravix.io'
  );

-- Política 5: Lectura general para funcionalidad del sistema (solo para admin)
CREATE POLICY "admin_read_all_users"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    (auth.jwt() ->> 'email') = 'ezequiel.canton@stravix.io'
  );