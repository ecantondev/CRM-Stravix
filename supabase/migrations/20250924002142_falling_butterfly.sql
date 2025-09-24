/*
  # Crear usuario administrador inicial

  1. Nuevo Usuario
    - Ezequiel Canton como administrador
    - Email: ezequiel.canton@stravix.io
    - Estado: ACTIVE (sin necesidad de aprobación)
    - Rol: ADMIN

  2. Configuración
    - Usuario listo para usar inmediatamente
    - Acceso completo al sistema
    - Puede aprobar otros usuarios

  NOTA: Este usuario debe registrarse primero en Supabase Auth
  con el email ezequiel.canton@stravix.io
*/

-- Función para crear el usuario admin si no existe
CREATE OR REPLACE FUNCTION create_initial_admin()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verificar si ya existe un admin
  IF NOT EXISTS (
    SELECT 1 FROM users WHERE email = 'ezequiel.canton@stravix.io'
  ) THEN
    -- Insertar usuario admin inicial
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
      gen_random_uuid(),
      'ezequiel.canton@stravix.io',
      'Ezequiel Canton',
      'ADMIN',
      'ACTIVE',
      'Administración',
      now(),
      now()
    );
    
    RAISE NOTICE 'Usuario administrador inicial creado: ezequiel.canton@stravix.io';
  ELSE
    RAISE NOTICE 'Usuario administrador ya existe';
  END IF;
END;
$$;

-- Ejecutar la función
SELECT create_initial_admin();

-- Limpiar la función temporal
DROP FUNCTION create_initial_admin();