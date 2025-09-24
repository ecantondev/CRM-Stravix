import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Shield, Activity, Settings, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useSupabaseAuth } from '../../hooks/useSupabaseAuth';
import { supabase } from '../../config/supabase';
import { useLeads } from '../../hooks/useLeads';
import { useTasks } from '../../hooks/useTasks';
import { USER_ROLE_OPTIONS } from '../../types/user';

export const AdminDashboard: React.FC = () => {
  const [users, setUsers] = React.useState<any[]>([]);
  const [usersLoading, setUsersLoading] = React.useState(true);
  const { leads } = useLeads();
  const { tasks } = useTasks();

  React.useEffect(() => {
    const fetchUsers = async () => {
      if (!supabase) {
        setUsersLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setUsers(data || []);
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers([]);
      } finally {
        setUsersLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const userStats = {
    total: users.length,
    active: users.filter(u => u.status === 'ACTIVE').length,
    admins: users.filter(u => u.role === 'ADMIN').length,
    newThisMonth: users.filter(u => {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return new Date(u.created_at) >= monthAgo;
    }).length
  };

  const systemStats = {
    totalLeads: leads.length,
    totalTasks: tasks.length,
    activeUsers: userStats.active,
    systemHealth: 98.5
  };

  const recentActivity = [
    {
      id: '1',
      type: 'user_created',
      message: 'Nuevo usuario Sofia Hernández creado',
      timestamp: '2024-12-20T10:30:00Z',
      user: 'Carlos Rodríguez'
    },
    {
      id: '2',
      type: 'user_updated',
      message: 'Usuario David López desactivado',
      timestamp: '2024-12-19T15:45:00Z',
      user: 'Ana García'
    },
    {
      id: '3',
      type: 'system_update',
      message: 'Configuración de notificaciones actualizada',
      timestamp: '2024-12-19T09:20:00Z',
      user: 'Sistema'
    },
    {
      id: '4',
      type: 'backup_completed',
      message: 'Respaldo automático completado exitosamente',
      timestamp: '2024-12-19T02:00:00Z',
      user: 'Sistema'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_created':
        return <Users className="w-4 h-4 text-green-600" />;
      case 'user_updated':
        return <Shield className="w-4 h-4 text-blue-600" />;
      case 'system_update':
        return <Settings className="w-4 h-4 text-purple-600" />;
      case 'backup_completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleConfig = (role: string) => {
    return USER_ROLE_OPTIONS.find(option => option.value === role) || USER_ROLE_OPTIONS[0];
  };
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Administración</h1>
        <p className="text-gray-600">Gestiona usuarios, configuración y monitorea el sistema</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-medium text-green-600">
              +{userStats.newThisMonth} este mes
            </span>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{userStats.total}</p>
            <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            {userStats.total > 0 && (
              <span className="text-sm font-medium text-green-600">
                {Math.round((userStats.active / userStats.total) * 100)}% activos
              </span>
            )}
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{userStats.active}</p>
            <p className="text-sm font-medium text-gray-600">Usuarios Activos</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{userStats.admins}</p>
            <p className="text-sm font-medium text-gray-600">Administradores</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-medium text-green-600">
              {systemStats.systemHealth}%
            </span>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900 mb-1">Óptimo</p>
            <p className="text-sm font-medium text-gray-600">Estado del Sistema</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* System Overview */}
        <div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Resumen del Sistema</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{systemStats.totalLeads}</p>
                <p className="text-sm text-gray-600">Leads</p>
              </div>

              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{systemStats.totalTasks}</p>
                <p className="text-sm text-gray-600">Tareas</p>
              </div>

              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Activity className="w-4 h-4 text-white" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{systemStats.activeUsers}</p>
                <p className="text-sm text-gray-600">Activos</p>
              </div>

              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{systemStats.systemHealth}%</p>
                <p className="text-sm text-gray-600">Salud</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Actividad Reciente</h2>
            
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 mt-0.5">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                      <span>Por {activity.user}</span>
                      <span>•</span>
                      <span>{formatTime(activity.timestamp)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions & Alerts */}
        <div>
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
            
            <div className="space-y-3">
              <Link 
                to="/app/users"
                className="w-full flex items-center gap-3 p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <Users className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-900">Gestionar Usuarios</span>
              </Link>
              
              <Link 
                to="/app/admin/settings"
                className="w-full flex items-center gap-3 p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-900">Configuración Sistema</span>
              </Link>
              
              <Link 
                to="/app/analytics"
                className="w-full flex items-center gap-3 p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
              >
                <Activity className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-purple-900">Ver Analytics</span>
              </Link>
              
              <Link 
                to="/app/leads"
                className="w-full flex items-center gap-3 p-3 text-left bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
              >
                <Users className="w-5 h-5 text-orange-600" />
                <span className="font-medium text-orange-900">Gestionar Leads</span>
              </Link>
              
              <Link 
                to="/app/admin/checklist"
                className="w-full flex items-center gap-3 p-3 text-left bg-stravix-50 hover:bg-stravix-100 rounded-lg transition-colors"
              >
                <CheckCircle className="w-5 h-5 text-stravix-600" />
                <span className="font-medium text-stravix-900">Lista Producción</span>
              </Link>
            </div>
          </div>

          {/* System Alerts */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertas del Sistema</h3>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-900">Sistema Actualizado</p>
                  <p className="text-xs text-green-700">Última actualización: Hoy 02:00</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-900">Respaldo Programado</p>
                  <p className="text-xs text-yellow-700">Próximo respaldo: Mañana 02:00</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Mantenimiento</p>
                  <p className="text-xs text-blue-700">Programado: Dom 25 Dic, 03:00</p>
                </div>
              </div>
            </div>
          </div>

          {/* System Health */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Salud del Sistema</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">CPU</span>
                  <span className="text-sm text-gray-600">23%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '23%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Memoria</span>
                  <span className="text-sm text-gray-600">67%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '67%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Almacenamiento</span>
                  <span className="text-sm text-gray-600">45%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Base de Datos</span>
                  <span className="text-sm text-gray-600">Online</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">Conexión estable</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Users List */}
      {!usersLoading && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Usuarios del Sistema</h2>
            <Link
              to="/app/admin/users"
              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              Ver todos →
            </Link>
          </div>
          
          {users.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No hay usuarios registrados</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Usuario</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Rol</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Estado</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Último Acceso</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.slice(0, 5).map((user) => {
                    const roleConfig = getRoleConfig(user.role);
                    const status = user.status || 'ACTIVE';
                    
                    return (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
                              {user.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-white font-semibold text-xs">
                                  {user.name.charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{user.name}</p>
                              <p className="text-xs text-gray-600">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${roleConfig.color}`}>
                            {roleConfig.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                            status === 'INACTIVE' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {status === 'ACTIVE' ? 'Activo' : status === 'INACTIVE' ? 'Inactivo' : 'Pendiente'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {user.last_login_at ? 
                            new Date(user.last_login_at).toLocaleDateString('es-ES') : 
                            'Nunca'
                          }
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};