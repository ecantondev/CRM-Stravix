import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { isSupabaseConfigured } from '../../config/supabase';
import { useAuth as useSupabaseAuth } from '../../contexts/SupabaseAuthContext';
import { useMockAuth } from '../../contexts/MockAuthContext';
import { 
  Building2, 
  Home,
  UserPlus, 
  CheckSquare,
  BarChart3,
  Settings, 
  LogOut,
  ChevronLeft,
  Users,
  TrendingUp,
  FolderOpen,
  Package,
  User,
  Shield,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggleCollapse }) => {
  // Use the appropriate auth hook based on configuration
  const supabaseAuth = isSupabaseConfigured ? useSupabaseAuth() : null;
  const mockAuth = !isSupabaseConfigured ? useMockAuth() : null;
  
  const { user, signOut } = isSupabaseConfigured ? supabaseAuth! : mockAuth!;
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/app', roles: ['ADMIN', 'MANAGER', 'SALES', 'READONLY'] },
    { icon: Building2, label: 'Empresas', path: '/app/companies', roles: ['ADMIN', 'MANAGER', 'SALES'] },
    { icon: UserPlus, label: 'Leads', path: '/app/leads', roles: ['ADMIN', 'MANAGER', 'SALES'] },
    { icon: Users, label: 'Contactos', path: '/app/contacts', roles: ['ADMIN', 'MANAGER', 'SALES'] },
    { icon: TrendingUp, label: 'Oportunidades', path: '/app/deals', roles: ['ADMIN', 'MANAGER', 'SALES'] },
    { icon: FolderOpen, label: 'Proyectos', path: '/app/projects', roles: ['ADMIN', 'MANAGER', 'SALES'] },
    { icon: Package, label: 'Productos', path: '/app/products', roles: ['ADMIN', 'MANAGER'] },
    { icon: CheckSquare, label: 'Tareas', path: '/app/tasks', roles: ['ADMIN', 'MANAGER', 'SALES'] },
    { icon: BarChart3, label: 'Analytics', path: '/app/analytics', roles: ['ADMIN', 'MANAGER'] },
    { icon: Shield, label: 'Administración', path: '/app/admin', roles: ['ADMIN'] },
    { icon: Users, label: 'Usuarios', path: '/app/users', roles: ['ADMIN'] },
  ];

  const userMenuItems = [
    { icon: User, label: 'Mi Perfil', path: '/app/profile', roles: ['ADMIN', 'MANAGER', 'SALES', 'READONLY'] },
    { icon: Settings, label: 'Configuración', path: '/app/settings', roles: ['ADMIN', 'MANAGER'] },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    user?.role && item.roles.includes(user.role)
  );

  const filteredUserMenuItems = userMenuItems.filter(item => 
    user?.role && item.roles.includes(user.role)
  );

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleUserMenu = () => {
    if (!isCollapsed) {
      setShowUserMenu(!showUserMenu);
    }
  };

  return (
    <div className={`bg-white border-r border-gray-200 h-screen flex flex-col transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-700 bg-clip-text text-transparent">Stravix</h1>
                <p className="text-xs text-gray-500 font-medium">CRM</p>
              </div>
            </div>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className={`w-5 h-5 text-gray-500 transition-transform ${
              isCollapsed ? 'rotate-180' : ''
            }`} />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {filteredMenuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 p-3 rounded-lg font-medium transition-colors ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200 shadow-sm' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {!isCollapsed && (
                    <span>{item.label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        {!isCollapsed && (
          <div className="mb-4">
            <button
              onClick={toggleUserMenu}
              className="w-full flex items-center gap-3 mb-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white font-semibold text-sm">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
              {showUserMenu ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>

            {/* User Menu Dropdown */}
            {showUserMenu && (
              <div className="mb-3 ml-2 space-y-1">
                {filteredUserMenuItems.map((item, index) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={index}
                      to={item.path}
                      className={`flex items-center gap-3 p-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive 
                          ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200' 
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                      onClick={() => setShowUserMenu(false)}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}

            <div className="mb-3">
              <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                user?.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                user?.role === 'MANAGER' ? 'bg-blue-100 text-blue-700' :
                user?.role === 'SALES' ? 'bg-green-100 text-green-700' :
                'bg-gray-100 text-gray-800'
              }`}>
                {user?.role}
              </span>
            </div>
          </div>
        )}
        <button
          onClick={handleSignOut}
          className={`w-full flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span className="font-medium">Salir</span>}
        </button>
      </div>
    </div>
  );
};