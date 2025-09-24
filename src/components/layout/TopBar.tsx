import React from 'react';
import { Search } from 'lucide-react';
import { NotificationCenter } from '../notifications/NotificationCenter';
import { isSupabaseConfigured } from '../../config/supabase';
import { useAuth as useSupabaseAuth } from '../../contexts/SupabaseAuthContext';
import { useMockAuth } from '../../contexts/MockAuthContext';

export const TopBar: React.FC = () => {
  // Use the appropriate auth hook based on configuration
  const supabaseAuth = isSupabaseConfigured ? useSupabaseAuth() : null;
  const mockAuth = !isSupabaseConfigured ? useMockAuth() : null;
  
  const { user } = isSupabaseConfigured ? supabaseAuth! : mockAuth!;

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar leads, empresas..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <NotificationCenter />
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-stravix-500 to-stravix-600 rounded-full flex items-center justify-center overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-white font-semibold text-xs">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};