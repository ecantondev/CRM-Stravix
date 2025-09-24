import React, { useState } from 'react';
import { CheckCircle, Circle, AlertTriangle, ExternalLink, Database, Shield, Globe, Zap } from 'lucide-react';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  required: boolean;
  category: 'database' | 'auth' | 'deployment' | 'security';
}

export const ProductionChecklist: React.FC = () => {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    // Database
    {
      id: 'supabase-setup',
      title: 'Configurar Supabase',
      description: 'Crear proyecto y configurar variables de entorno',
      completed: false,
      required: true,
      category: 'database'
    },
    {
      id: 'run-migrations',
      title: 'Ejecutar Migraciones SQL',
      description: 'Crear todas las tablas y configurar RLS',
      completed: false,
      required: true,
      category: 'database'
    },
    {
      id: 'seed-data',
      title: 'Datos de Prueba (Opcional)',
      description: 'Insertar datos de ejemplo para testing',
      completed: false,
      required: false,
      category: 'database'
    },
    
    // Authentication
    {
      id: 'auth-config',
      title: 'Configurar Autenticación',
      description: 'Habilitar email/password en Supabase Auth',
      completed: false,
      required: true,
      category: 'auth'
    },
    {
      id: 'admin-user',
      title: 'Crear Usuario Administrador',
      description: 'Registrar primer usuario con rol ADMIN',
      completed: false,
      required: true,
      category: 'auth'
    },
    
    // Security
    {
      id: 'rls-policies',
      title: 'Verificar Políticas RLS',
      description: 'Confirmar que todas las tablas tienen RLS habilitado',
      completed: false,
      required: true,
      category: 'security'
    },
    {
      id: 'env-security',
      title: 'Seguridad de Variables',
      description: 'Verificar que las claves no estén expuestas',
      completed: false,
      required: true,
      category: 'security'
    },
    
    // Deployment
    {
      id: 'build-test',
      title: 'Probar Build de Producción',
      description: 'Verificar que npm run build funcione correctamente',
      completed: false,
      required: true,
      category: 'deployment'
    },
    {
      id: 'domain-setup',
      title: 'Configurar Dominio',
      description: 'Configurar dominio personalizado (opcional)',
      completed: false,
      required: false,
      category: 'deployment'
    }
  ]);

  const toggleItem = (id: string) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'database': return <Database className="w-5 h-5" />;
      case 'auth': return <Shield className="w-5 h-5" />;
      case 'security': return <Shield className="w-5 h-5" />;
      case 'deployment': return <Globe className="w-5 h-5" />;
      default: return <Circle className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'database': return 'text-blue-600 bg-blue-50';
      case 'auth': return 'text-green-600 bg-green-50';
      case 'security': return 'text-red-600 bg-red-50';
      case 'deployment': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const requiredItems = checklist.filter(item => item.required);
  const completedRequired = requiredItems.filter(item => item.completed).length;
  const totalRequired = requiredItems.length;
  const progressPercentage = (completedRequired / totalRequired) * 100;

  const groupedItems = checklist.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ChecklistItem[]>);

  const categoryLabels = {
    database: 'Base de Datos',
    auth: 'Autenticación',
    security: 'Seguridad',
    deployment: 'Despliegue'
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Lista de Verificación para Producción</h1>
          <p className="text-gray-600">Completa estos pasos para publicar tu CRM</p>
        </div>

        {/* Progress Overview */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Progreso General</h2>
            <span className="text-2xl font-bold text-blue-600">
              {completedRequired}/{totalRequired}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {completedRequired === totalRequired ? 
                '¡Listo para producción!' : 
                `${totalRequired - completedRequired} elementos requeridos pendientes`
              }
            </span>
            <span className="font-medium text-blue-600">
              {progressPercentage.toFixed(0)}% completado
            </span>
          </div>
        </div>

        {/* Checklist by Category */}
        <div className="space-y-8">
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category} className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getCategoryColor(category)}`}>
                  {getCategoryIcon(category)}
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {categoryLabels[category as keyof typeof categoryLabels]}
                </h3>
              </div>

              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-start gap-4 p-4 rounded-lg border transition-all ${
                      item.completed 
                        ? 'bg-green-50 border-green-200' 
                        : item.required 
                          ? 'bg-orange-50 border-orange-200' 
                          : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <button
                      onClick={() => toggleItem(item.id)}
                      className="flex-shrink-0 mt-0.5"
                    >
                      {item.completed ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-400 hover:text-blue-600 transition-colors" />
                      )}
                    </button>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={`font-medium ${
                          item.completed ? 'text-green-900' : 'text-gray-900'
                        }`}>
                          {item.title}
                        </h4>
                        {item.required && !item.completed && (
                          <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                            Requerido
                          </span>
                        )}
                      </div>
                      <p className={`text-sm ${
                        item.completed ? 'text-green-700' : 'text-gray-600'
                      }`}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white mt-8">
          <h3 className="text-xl font-semibold mb-4">Enlaces Útiles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="https://app.supabase.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
              <Database className="w-5 h-5" />
              <span>Dashboard de Supabase</span>
              <ExternalLink className="w-4 h-4 ml-auto" />
            </a>
            
            <a
              href="https://supabase.com/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
              <Shield className="w-5 h-5" />
              <span>Documentación</span>
              <ExternalLink className="w-4 h-4 ml-auto" />
            </a>
          </div>
        </div>

        {/* Ready to Deploy */}
        {progressPercentage === 100 && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mt-8">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <h3 className="text-xl font-semibold text-green-900">¡Listo para Producción!</h3>
            </div>
            <p className="text-green-700 mb-4">
              Has completado todos los elementos requeridos. Tu CRM está listo para ser desplegado.
            </p>
            <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Desplegar a Producción
            </button>
          </div>
        )}
      </div>
    </div>
  );
};