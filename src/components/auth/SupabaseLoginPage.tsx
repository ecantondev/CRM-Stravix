import React, { useState } from 'react';
import { useSupabaseAuth } from '../../hooks/useSupabaseAuth';
import { useNavigate } from 'react-router-dom';
import { Building2, Shield, AlertCircle, Mail, Lock, Eye, EyeOff, Zap, TrendingUp, Users, CheckCircle } from 'lucide-react';

export const SupabaseLoginPage: React.FC = () => {
  const { signInWithEmail, signUpWithEmail } = useSupabaseAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Por favor completa todos los campos requeridos');
      return;
    }

    if (isSignUp && !formData.name) {
      setError('El nombre es requerido para crear una cuenta');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      if (isSignUp) {
        console.log('📝 Starting signup process...');
        const result = await signUpWithEmail(formData.email, formData.password, formData.name);
        
        if (result.user) {
          setSuccess('¡Cuenta creada exitosamente! Puedes iniciar sesión ahora.');
          setIsSignUp(false);
          setFormData({ email: formData.email, password: '', name: '' });
        }
      } else {
        console.log('🔐 Starting signin process...');
        await signInWithEmail(formData.email, formData.password);
        console.log('✅ Signin successful, redirecting...');
        // Navigate immediately, auth state will handle the rest
        navigate('/app');
      }
    } catch (error: any) {
      console.error('❌ Error en autenticación:', error);
      
      // Handle specific error cases
      if (error.message?.includes('Invalid login credentials')) {
        setError('Credenciales incorrectas. Verifica tu email y contraseña.');
      } else if (error.message?.includes('Email not confirmed')) {
        setError('Por favor confirma tu email antes de iniciar sesión.');
      } else if (error.message?.includes('User not found')) {
        setError('Usuario no encontrado. ¿Necesitas crear una cuenta?');
      } else if (error.message?.includes('Password should be at least')) {
        setError('La contraseña debe tener al menos 6 caracteres.');
      } else if (error.message?.includes('User already registered')) {
        setError('Este email ya está registrado. ¿Quieres iniciar sesión?');
      } else if (error.message?.includes('Signup not allowed')) {
        setError('El registro no está permitido. Contacta al administrador.');
      } else if (error.message?.includes('Database error')) {
        setError('Error de base de datos. Verifica que las migraciones estén ejecutadas.');
      } else {
        setError(error.message || 'Error en la autenticación. Inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
    if (success) setSuccess(null);
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
      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Hero Content */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 text-white">
          <div className="max-w-lg">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">S</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold">Stravix CRM</h1>
                <p className="text-blue-200">Plataforma B2B</p>
              </div>
            </div>

            <h2 className="text-5xl font-bold mb-6 leading-tight">
              Gestiona tus leads como un
              <span className="bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent"> profesional</span>
            </h2>

            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Automatiza tu proceso de ventas, gestiona contactos y cierra más deals con nuestra plataforma integral de CRM.
            </p>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Pipeline Inteligente</h3>
                  <p className="text-blue-200 text-sm">Gestiona oportunidades con IA</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Gestión de Contactos</h3>
                  <p className="text-blue-200 text-sm">Centraliza toda tu red profesional</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Automatización</h3>
                  <p className="text-blue-200 text-sm">Workflows automáticos</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl mb-6">
                <span className="text-white font-bold text-3xl">S</span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">Stravix CRM</h1>
              <p className="text-blue-200 font-medium">Plataforma de gestión B2B</p>
            </div>

            {/* Login Card */}
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {isSignUp ? 'Crear Cuenta' : 'Bienvenido'}
                </h2>
                <p className="text-gray-600">
                  {isSignUp ? 'Crea tu cuenta en Stravix' : 'Accede a tu plataforma CRM'}
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignUp && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Tu nombre completo"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="tu@empresa.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña *
                  </label>
                  <div className="relative">
                    <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Tu contraseña"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {isSignUp && (
                    <p className="mt-1 text-xs text-gray-500">Mínimo 6 caracteres</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white rounded-2xl px-8 py-4 font-bold text-lg hover:from-blue-700 hover:via-purple-700 hover:to-indigo-800 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5"
                >
                  <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                    <span className="font-bold text-xl">S</span>
                  </div>
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {isSignUp ? 'Creando cuenta...' : 'Iniciando sesión...'}
                    </>
                  ) : (
                    <>
                      {isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión'}
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError(null);
                    setSuccess(null);
                  }}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  {isSignUp 
                    ? '¿Ya tienes cuenta? Inicia sesión' 
                    : '¿No tienes cuenta? Regístrate'
                  }
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
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-blue-400/20 rounded-full blur-xl animate-pulse delay-500"></div>
    </div>
  );
};