import React from 'react';
import { Clock, Shield, Mail, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/SupabaseAuthContext';

export const PendingApprovalPage: React.FC = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop)'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-purple-900/85 to-indigo-900/90"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Pending Approval Card */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 text-center">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-10 h-10 text-orange-600" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">Cuenta Pendiente</h1>
            
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-5 h-5 text-orange-600" />
                <span className="font-medium text-orange-900">Esperando Aprobación</span>
              </div>
              <p className="text-sm text-orange-700">
                Tu cuenta ha sido creada exitosamente, pero necesita ser aprobada por un administrador antes de que puedas acceder al sistema.
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Cuenta creada exitosamente</span>
              </div>
              
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Mail className="w-4 h-4 text-blue-600" />
                <span>Email verificado: {user?.email}</span>
              </div>
              
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Clock className="w-4 h-4 text-orange-600" />
                <span>Pendiente de aprobación administrativa</span>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <h3 className="font-medium text-blue-900 mb-2">¿Qué sigue?</h3>
              <ul className="text-sm text-blue-700 space-y-1 text-left">
                <li>• Un administrador revisará tu solicitud</li>
                <li>• Recibirás un email cuando sea aprobada</li>
                <li>• Podrás acceder con tus credenciales</li>
              </ul>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Si tienes preguntas, contacta al administrador del sistema.
              </p>
              
              <button
                onClick={handleSignOut}
                className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-sm text-white/80">
              © 2025 Stravix. Plataforma CRM empresarial.
            </p>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-blue-400/20 rounded-full blur-xl animate-pulse delay-500"></div>
    </div>
  );
};