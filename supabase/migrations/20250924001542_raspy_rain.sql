/*
  # Agregar Usuario Administrador Inicial

  1. Nuevo Usuario
    - Ezequiel Canton como administrador inicial
    - Email: ezequiel.canton@stravix.io
    - Estado: ACTIVE (aprobado automáticamente)
    - Rol: ADMIN

  2. Función de Inicialización
    - Crear usuario admin si no existe
    - Configurar permisos completos
*/

-- Función para crear usuario administrador inicial
CREATE OR REPLACE FUNCTION create_initial_admin()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Verificar si ya existe un administrador
  IF EXISTS (SELECT 1 FROM users WHERE role = 'ADMIN' AND status = 'ACTIVE') THEN
    RAISE NOTICE 'Ya existe un administrador activo en el sistema';
    RETURN;
  END IF;

  -- Generar ID para el usuario admin
  admin_user_id := gen_random_uuid();

  -- Insertar usuario administrador inicial
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
    admin_user_id,
    'ezequiel.canton@stravix.io',
    'Ezequiel Canton',
    'ADMIN',
    'ACTIVE',
    'Administración',
    now(),
    now()
  )
  ON CONFLICT (email) DO UPDATE SET
    role = 'ADMIN',
    status = 'ACTIVE',
    name = 'Ezequiel Canton',
    department = 'Administración',
    updated_at = now();

  RAISE NOTICE 'Usuario administrador inicial creado: ezequiel.canton@stravix.io';
END;
$$;

-- Ejecutar la función
SELECT create_initial_admin();

-- Crear política especial para el primer login del admin
CREATE POLICY "Allow admin signup" ON users
  FOR INSERT
  TO anon
  WITH CHECK (email = 'ezequiel.canton@stravix.io');

-- Función para manejar el primer login del admin
CREATE OR REPLACE FUNCTION handle_admin_first_login()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Si es el admin inicial, asegurar que tenga los permisos correctos
  IF NEW.email = 'ezequiel.canton@stravix.io' THEN
    -- Actualizar o insertar en la tabla users
    INSERT INTO users (
      id,
      email,
      name,
      role,
      status,
      department,
      created_at,
      updated_at,
      last_login_at
    ) VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'name', 'Ezequiel Canton'),
      'ADMIN',
      'ACTIVE',
      'Administración',
      now(),
      now(),
      now()
    )
    ON CONFLICT (id) DO UPDATE SET
      role = 'ADMIN',
      status = 'ACTIVE',
      name = COALESCE(NEW.raw_user_meta_data->>'name', 'Ezequiel Canton'),
      last_login_at = now(),
      updated_at = now();
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger para el primer login del admin
DROP TRIGGER IF EXISTS on_admin_first_login ON auth.users;
CREATE TRIGGER on_admin_first_login
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_admin_first_login();