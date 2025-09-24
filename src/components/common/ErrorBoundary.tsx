import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🚨 Error caught by boundary:', error);
    console.error('📍 Error info:', errorInfo);
    
    // Log to external service in production
    if (import.meta.env.PROD) {
      // You can add error reporting service here
      console.error('Production error:', { error, errorInfo });
    }
    
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

const ErrorFallback: React.FC<{ error?: Error }> = ({ error }) => {
  const navigate = useNavigate();

  const handleReload = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    navigate('/login');
  };

  const handleClearStorage = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Algo salió mal</h1>
          <p className="text-gray-600 mb-6">
            Ha ocurrido un error inesperado. Esto puede deberse a:
          </p>
          
          <div className="text-left bg-gray-50 rounded-lg p-4 mb-6">
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• Base de datos no configurada correctamente</li>
              <li>• Migraciones SQL no ejecutadas</li>
              <li>• Problema de conectividad</li>
              <li>• Datos corruptos en el navegador</li>
            </ul>
          </div>

          {error && (
            <details className="text-left bg-red-50 rounded-lg p-4 mb-6">
              <summary className="cursor-pointer font-medium text-red-900 mb-2">
                Ver detalles técnicos
              </summary>
              <pre className="text-xs text-red-700 overflow-auto">
                {error.message}
                {error.stack && `\n\n${error.stack}`}
              </pre>
            </details>
          )}
          
          <div className="space-y-3">
            <button
              onClick={handleReload}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Recargar Página
            </button>
            
            <button
              onClick={handleGoHome}
              className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Ir al Login
            </button>
            
            <button
              onClick={handleClearStorage}
              className="w-full text-red-600 hover:text-red-800 px-6 py-2 rounded-lg font-medium transition-colors text-sm"
            >
              Limpiar datos y reiniciar
            </button>
          </div>
        </div>
        
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Si el problema persiste, contacta al administrador del sistema
          </p>
        </div>
      </div>
    </div>
  );
};