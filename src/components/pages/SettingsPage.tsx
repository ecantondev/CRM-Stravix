import React from 'react';
import { Settings, User, Shield, Bell } from 'lucide-react';
import { useAuth } from '../../contexts/SupabaseAuthContext';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Configuración</h1>
        <p className="text-gray-600">Gestiona tu perfil y preferencias del sistema</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-6 h-6 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">Perfil</h2>
            </div>
            
            <div className="flex items-center gap-6 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center overflow-hidden">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white font-semibold text-2xl">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{user?.name}</h3>
                <p className="text-gray-600">{user?.email}</p>
                <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full mt-2 ${
                  user?.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                  user?.role === 'MANAGER' ? 'bg-blue-100 text-blue-800' :
                  user?.role === 'SALES' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {user?.role}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                <input
                  type="text"
                  value={user?.name || ''}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Permissions Section */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">Permisos</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Gestionar Leads</h4>
                  <p className="text-sm text-gray-600">Crear, editar y eliminar leads</p>
                </div>
                <span className="text-green-600 font-medium">✓ Permitido</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Ver Reportes</h4>
                  <p className="text-sm text-gray-600">Acceso a estadísticas y reportes</p>
                </div>
                <span className={`font-medium ${
                  user?.role === 'READONLY' ? 'text-red-600' : 'text-green-600'
                }`}>
                  {user?.role === 'READONLY' ? '✗ Denegado' : '✓ Permitido'}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Gestionar Usuarios</h4>
                  <p className="text-sm text-gray-600">Administrar usuarios del sistema</p>
                </div>
                <span className={`font-medium ${
                  user?.role === 'ADMIN' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {user?.role === 'ADMIN' ? '✓ Permitido' : '✗ Denegado'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-6 h-6 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Notificaciones</h3>
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                <span className="text-sm text-gray-700">Nuevos leads</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                <span className="text-sm text-gray-700">Citas agendadas</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="text-sm text-gray-700">Reportes semanales</span>
              </label>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de Cuenta</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Miembro desde:</span>
                <span className="text-gray-900">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Último acceso:</span>
                <span className="text-gray-900">
                  {user?.last_login_at ? new Date(user.last_login_at).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};