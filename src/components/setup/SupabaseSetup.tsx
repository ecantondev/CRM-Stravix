import React from 'react';
import { ExternalLink, Database, Key, AlertCircle, CheckCircle, Copy, ArrowRight } from 'lucide-react';

export const SupabaseSetup: React.FC = () => {
  const [copied, setCopied] = React.useState<string | null>(null);

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  const envTemplate = `VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_anon_aqui`;

  const migrationSQL = `/*
  # Configuración inicial de autenticación y usuarios

  1. Nuevas Tablas
    - Configuración de triggers para usuarios automáticos
    - Políticas RLS simples sin recursión

  2. Seguridad
    - Enable RLS en todas las tablas
    - Políticas para registro y gestión de usuarios
*/

-- Primero, eliminar todas las políticas existentes que pueden causar recursión
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can read all users" ON users;
DROP POLICY IF EXISTS "Users can read own profile during registration" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Allow user registration" ON users;
DROP POLICY IF EXISTS "Allow admin signup" ON users;
DROP POLICY IF EXISTS "Admins can manage users" ON users;

-- Función para manejar nuevos usuarios
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_count INTEGER;
BEGIN
  -- Contar usuarios existentes
  SELECT COUNT(*) INTO user_count FROM users;
  
  -- Insertar nuevo usuario en la tabla users
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
      WHEN user_count = 0 THEN 'ADMIN'::user_role 
      WHEN NEW.email = 'ezequiel.canton@stravix.io' THEN 'ADMIN'::user_role
      ELSE 'SALES'::user_role 
    END,
    CASE 
      WHEN user_count = 0 THEN 'ACTIVE'::user_status
      WHEN NEW.email = 'ezequiel.canton@stravix.io' THEN 'ACTIVE'::user_status
      ELSE 'PENDING'::user_status 
    END,
    now(), 
    now()
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear usuario automáticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Función para actualizar last_login
CREATE OR REPLACE FUNCTION update_last_login()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users 
  SET last_login_at = now()
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para actualizar last_login
DROP TRIGGER IF EXISTS on_auth_user_login ON auth.users;
CREATE TRIGGER on_auth_user_login
  AFTER UPDATE OF last_sign_in_at ON auth.users
  FOR EACH ROW EXECUTE FUNCTION update_last_login();

-- Crear políticas RLS simples sin recursión
CREATE POLICY "Users can read own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow user registration"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Política especial para admin (sin recursión)
CREATE POLICY "Admin can manage all users"
  ON users
  FOR ALL
  TO authenticated
  USING (
    auth.jwt() ->> 'email' = 'ezequiel.canton@stravix.io'
    OR 
    (auth.uid() = id)
  );`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl mb-6 shadow-2xl">
            <Database className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Configurar Supabase
          </h1>
          <p className="text-gray-600 font-medium">Configura tu base de datos para comenzar con Stravix CRM</p>
        </div>

        {/* Setup Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Configuración Requerida</h2>
          </div>

          <div className="space-y-8">
            {/* Step 1 */}
            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Crear Proyecto en Supabase</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Crea un nuevo proyecto en Supabase (es completamente gratis para empezar).
              </p>
              <a
                href="https://app.supabase.com/projects"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-lg"
              >
                <ExternalLink className="w-5 h-5" />
                Crear Proyecto en Supabase
              </a>
            </div>

            {/* Step 2 */}
            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Obtener Credenciales</h3>
              </div>
              <p className="text-gray-600 mb-4">
                En tu proyecto de Supabase, ve a <strong>Settings → API</strong> y copia:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span><strong>Project URL</strong> (URL del proyecto)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span><strong>Project API Key</strong> (anon, public)</span>
                  </li>
                </ul>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <p className="text-sm text-orange-800">
                  <strong>⚠️ Importante:</strong> También ve a <strong>Authentication → Settings</strong> y 
                  <strong> DESHABILITA</strong> "Enable email confirmations" para testing.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Configurar Variables de Entorno</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Haz clic en "Connect to Supabase" en la parte superior derecha, o crea un archivo <code className="bg-gray-100 px-2 py-1 rounded">.env</code>:
              </p>
              <div className="bg-gray-900 p-4 rounded-lg font-mono text-sm relative text-green-400">
                <div className="text-gray-400 mb-2"># Reemplaza con tus credenciales reales:</div>
                <div>VITE_SUPABASE_URL=https://tu-proyecto.supabase.co</div>
                <div>VITE_SUPABASE_ANON_KEY=tu_clave_anon_aqui</div>
                <button
                  onClick={() => copyToClipboard(envTemplate, 'env')}
                  className="absolute top-2 right-2 p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                >
                  {copied === 'env' ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Step 4 */}
            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Ejecutar Migración SQL</h3>
              </div>
              <p className="text-gray-600 mb-4">
                En el <strong>SQL Editor</strong> de Supabase, ejecuta esta migración para configurar la autenticación:
              </p>
              <div className="bg-gray-900 p-4 rounded-lg font-mono text-xs max-h-60 overflow-y-auto relative text-green-400">
                <button
                  onClick={() => copyToClipboard(migrationSQL, 'migration')}
                  className="absolute top-2 right-2 p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors z-10"
                >
                  {copied === 'migration' ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                <pre className="whitespace-pre-wrap">{migrationSQL}</pre>
              </div>
            </div>

            {/* Step 5 */}
            <div className="border border-green-200 rounded-xl p-6 bg-green-50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                  5
                </div>
                <h3 className="text-lg font-semibold text-green-900">¡Listo para Usar!</h3>
              </div>
              <p className="text-green-700 mb-4">
                Después de configurar todo, la aplicación se recargará automáticamente y podrás:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-green-600" />
                  <span className="text-green-700">Registrarte (primer usuario = admin)</span>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-green-600" />
                  <span className="text-green-700">Gestionar leads y oportunidades</span>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-green-600" />
                  <span className="text-green-700">Aprobar nuevos usuarios</span>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-green-600" />
                  <span className="text-green-700">Acceder a todas las funciones</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Setup Button */}
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">¿Necesitas ayuda?</h3>
                <p className="text-blue-100 text-sm">
                  Revisa la documentación de Supabase para más detalles sobre la configuración.
                </p>
              </div>
              <a
                href="https://supabase.com/docs/guides/getting-started"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <ExternalLink className="w-5 h-5" />
                Documentación
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Una vez configurado, la aplicación se recargará automáticamente
          </p>
        </div>
      </div>
    </div>
  );
};