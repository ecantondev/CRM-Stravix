import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isSupabaseConfigured } from '../../config/supabase';
import { useAuth as useSupabaseAuth } from '../../contexts/SupabaseAuthContext';
import { useMockAuth } from '../../contexts/MockAuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Use the appropriate auth hook based on configuration
  const supabaseAuth = isSupabaseConfigured ? useSupabaseAuth() : null;
  const mockAuth = !isSupabaseConfigured ? useMockAuth() : null;
  
  const { user, loading } = isSupabaseConfigured ? supabaseAuth! : mockAuth!;
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user is pending approval (only for Supabase)
  if (isSupabaseConfigured && user.status === 'PENDING') {
    return <Navigate to="/pending" replace />;
  }

  // Check if user is inactive
  if (user.status === 'INACTIVE') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h1>
          <p className="text-gray-600 mb-6">Tu cuenta ha sido desactivada. Contacta al administrador.</p>
          <button
            onClick={() => {
              if (isSupabaseConfigured && supabaseAuth) {
                supabaseAuth.signOut();
              } else if (mockAuth) {
                mockAuth.signOut();
              }
            }}
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};