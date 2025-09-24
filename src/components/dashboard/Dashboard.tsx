import React from 'react';
import { useLeads } from '../../hooks/useLeads';
import { useTasks } from '../../hooks/useTasks';
import { isSupabaseConfigured } from '../../config/supabase';
import { useAuth as useSupabaseAuth } from '../../contexts/SupabaseAuthContext';
import { useMockAuth } from '../../contexts/MockAuthContext';
import { Building2, Users, UserPlus, TrendingUp, CheckSquare, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  // Use the appropriate auth hook based on configuration
  const supabaseAuth = isSupabaseConfigured ? useSupabaseAuth() : null;
  const mockAuth = !isSupabaseConfigured ? useMockAuth() : null;
  
  const { user } = isSupabaseConfigured ? supabaseAuth! : mockAuth!;
  const { leads } = useLeads();
  const { tasks } = useTasks();

  const leadsStats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'NEW').length,
    inConversation: leads.filter(l => l.status === 'IN_CONVERSATION').length,
    closed: leads.filter(l => l.status === 'CLOSED').length,
  };

  const tasksStats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'PENDING').length,
    overdue: tasks.filter(t => 
      t.due_date && 
      new Date(t.due_date) < new Date() && 
      t.status !== 'COMPLETED'
    ).length,
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '¡Buenos días';
    if (hour < 18) return '¡Buenas tardes';
    return '¡Buenas noches';
  };

  return (
    <div className="p-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {getGreeting()}, {user?.name?.split(' ')[0]}!
        </h1>
        <p className="text-gray-600">
          Bienvenido a Stravix CRM - Tu centro de gestión de leads
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-stravix-500 to-stravix-600 rounded-xl flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            {leadsStats.total > 0 && (
              <span className="text-sm font-medium text-green-600">
                {Math.round((leadsStats.new / leadsStats.total) * 100)}% nuevos
              </span>
            )}
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{leadsStats.total}</p>
            <p className="text-sm font-medium text-gray-600">Leads Totales</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-stravix-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            {leadsStats.total > 0 && (
              <span className="text-sm font-medium text-blue-600">
                {Math.round((leadsStats.inConversation / leadsStats.total) * 100)}%
              </span>
            )}
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{leadsStats.inConversation}</p>
            <p className="text-sm font-medium text-gray-600">En Conversación</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <CheckSquare className="w-6 h-6 text-white" />
            </div>
            {tasksStats.overdue > 0 && (
              <span className="text-sm font-medium text-red-600">
                {tasksStats.overdue} vencidas
              </span>
            )}
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{tasksStats.total}</p>
            <p className="text-sm font-medium text-gray-600">Tareas</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            {leadsStats.total > 0 && (
              <span className="text-sm font-medium text-green-600">
                {Math.round((leadsStats.closed / leadsStats.total) * 100)}% cerrados
              </span>
            )}
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{new Set(leads.map(l => l.company)).size}</p>
            <p className="text-sm font-medium text-gray-600">Empresas</p>
          </div>
        </div>
      </div>

      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-stravix-500 via-stravix-600 to-red-600 rounded-2xl p-8 text-white mb-8 shadow-xl">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold mb-4">¡Bienvenido a Stravix CRM!</h2>
          <p className="text-stravix-100 mb-6">
            Tu plataforma integral para gestionar leads B2B, hacer seguimiento de conversaciones,
            gestionar tareas y cerrar más ventas. Comienza agregando tu primer lead.
          </p>
          <div className="flex gap-4">
            <Link
              to="/app/leads/new"
              className="bg-white text-stravix-600 px-6 py-3 rounded-lg font-semibold hover:bg-stravix-50 transition-colors shadow-lg"
            >
              Agregar Lead
            </Link>
            <Link
              to="/app/tasks"
              className="border-2 border-white/30 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Ver Tareas
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/app/leads/new"
            className="flex items-center gap-3 p-4 rounded-xl bg-stravix-50 hover:bg-stravix-100 text-stravix-700 transition-colors"
          >
            <UserPlus className="w-5 h-5" />
            <span className="font-medium">Nuevo Lead</span>
          </Link>
          
          <Link
            to="/app/leads"
            className="flex items-center gap-3 p-4 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 transition-colors"
          >
            <TrendingUp className="w-5 h-5" />
            <span className="font-medium">Ver Leads</span>
          </Link>
          
          <Link
            to="/app/tasks"
            className="flex items-center gap-3 p-4 rounded-xl bg-green-50 hover:bg-green-100 text-green-700 transition-colors"
          >
            <CheckSquare className="w-5 h-5" />
            <span className="font-medium">Gestionar Tareas</span>
          </Link>
          
          <div className="flex items-center gap-3 p-4 rounded-xl bg-purple-50 text-purple-700">
            <AlertTriangle className="w-5 h-5" />
            <div>
              <span className="font-medium block">Tareas Vencidas</span>
              <span className="text-sm">{tasksStats.overdue} pendientes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};