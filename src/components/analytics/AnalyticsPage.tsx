import React, { useMemo } from 'react';
import { useLeads } from '../../hooks/useLeads';
import { useTasks } from '../../hooks/useTasks';
import { BarChart3, TrendingUp, Users, Calendar, Target, Clock } from 'lucide-react';
import { StatsCard } from '../dashboard/StatsCard';

export const AnalyticsPage: React.FC = () => {
  const { leads } = useLeads();
  const { tasks } = useTasks();

  const analytics = useMemo(() => {
    // Lead Analytics
    const totalLeads = leads.length;
    const newLeads = leads.filter(l => l.status === 'NEW').length;
    const contactedLeads = leads.filter(l => l.status === 'CONTACTED').length;
    const inConversationLeads = leads.filter(l => l.status === 'IN_CONVERSATION').length;
    const meetingLeads = leads.filter(l => l.status === 'MEETING').length;
    const closedLeads = leads.filter(l => l.status === 'CLOSED').length;

    // Conversion rates
    const contactedRate = totalLeads > 0 ? (contactedLeads / totalLeads) * 100 : 0;
    const conversationRate = totalLeads > 0 ? (inConversationLeads / totalLeads) * 100 : 0;
    const meetingRate = totalLeads > 0 ? (meetingLeads / totalLeads) * 100 : 0;
    const closureRate = totalLeads > 0 ? (closedLeads / totalLeads) * 100 : 0;

    // Task Analytics
    const totalTasks = tasks.length;
    const pendingTasks = tasks.filter(t => t.status === 'PENDING').length;
    const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS').length;
    const completedTasks = tasks.filter(t => t.status === 'COMPLETED').length;
    const overdueTasks = tasks.filter(t => 
      t.due_date && 
      new Date(t.due_date) < new Date() && 
      t.status !== 'COMPLETED'
    ).length;

    // Task completion rate
    const taskCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    // Companies
    const uniqueCompanies = new Set(leads.map(l => l.company)).size;

    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentLeads = leads.filter(l => new Date(l.created_at) >= thirtyDaysAgo).length;
    const recentTasks = tasks.filter(t => new Date(t.created_at) >= thirtyDaysAgo).length;

    return {
      leads: {
        total: totalLeads,
        new: newLeads,
        contacted: contactedLeads,
        inConversation: inConversationLeads,
        meeting: meetingLeads,
        closed: closedLeads,
        contactedRate,
        conversationRate,
        meetingRate,
        closureRate,
        recent: recentLeads
      },
      tasks: {
        total: totalTasks,
        pending: pendingTasks,
        inProgress: inProgressTasks,
        completed: completedTasks,
        overdue: overdueTasks,
        completionRate: taskCompletionRate,
        recent: recentTasks
      },
      companies: uniqueCompanies
    };
  }, [leads, tasks]);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
        <p className="text-gray-600">Métricas y análisis del rendimiento del CRM</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total de Leads"
          value={analytics.leads.total}
          icon={Users}
          trend={{ value: analytics.leads.recent, isPositive: analytics.leads.recent > 0 }}
          color="blue"
        />
        
        <StatsCard
          title="Tasa de Cierre"
          value={`${analytics.leads.closureRate.toFixed(1)}%`}
          icon={Target}
          trend={{ value: analytics.leads.closureRate, isPositive: analytics.leads.closureRate > 20 }}
          color="green"
        />
        
        <StatsCard
          title="Tareas Completadas"
          value={`${analytics.tasks.completionRate.toFixed(1)}%`}
          icon={Clock}
          trend={{ value: analytics.tasks.completionRate, isPositive: analytics.tasks.completionRate > 70 }}
          color="purple"
        />
        
        <StatsCard
          title="Empresas Únicas"
          value={analytics.companies}
          icon={BarChart3}
          color="orange"
        />
      </div>

      {/* Lead Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Pipeline de Leads</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <span className="font-medium text-gray-900">Nuevos</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-gray-900">{analytics.leads.new}</span>
                <p className="text-sm text-gray-500">leads</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="font-medium text-gray-900">Contactados</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-gray-900">{analytics.leads.contacted}</span>
                <p className="text-sm text-gray-500">{analytics.leads.contactedRate.toFixed(1)}% del total</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="font-medium text-gray-900">En Conversación</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-gray-900">{analytics.leads.inConversation}</span>
                <p className="text-sm text-gray-500">{analytics.leads.conversationRate.toFixed(1)}% del total</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="font-medium text-gray-900">Cita Agendada</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-gray-900">{analytics.leads.meeting}</span>
                <p className="text-sm text-gray-500">{analytics.leads.meetingRate.toFixed(1)}% del total</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium text-gray-900">Cerrados</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-gray-900">{analytics.leads.closed}</span>
                <p className="text-sm text-gray-500">{analytics.leads.closureRate.toFixed(1)}% del total</p>
              </div>
            </div>
          </div>
        </div>

        {/* Task Analytics */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Estado de Tareas</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <span className="font-medium text-gray-900">Pendientes</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-gray-900">{analytics.tasks.pending}</span>
                <p className="text-sm text-gray-500">tareas</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="font-medium text-gray-900">En Progreso</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-gray-900">{analytics.tasks.inProgress}</span>
                <p className="text-sm text-gray-500">tareas</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium text-gray-900">Completadas</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-gray-900">{analytics.tasks.completed}</span>
                <p className="text-sm text-gray-500">{analytics.tasks.completionRate.toFixed(1)}% del total</p>
              </div>
            </div>

            {analytics.tasks.overdue > 0 && (
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="font-medium text-gray-900">Vencidas</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-red-600">{analytics.tasks.overdue}</span>
                  <p className="text-sm text-red-500">requieren atención</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Insights de Rendimiento</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
            <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Conversión</h3>
            <p className="text-3xl font-bold text-blue-600 mb-1">
              {analytics.leads.conversationRate.toFixed(1)}%
            </p>
            <p className="text-sm text-gray-600">
              De leads nuevos a conversación
            </p>
          </div>

          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
            <Target className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Cierre</h3>
            <p className="text-3xl font-bold text-green-600 mb-1">
              {analytics.leads.closureRate.toFixed(1)}%
            </p>
            <p className="text-sm text-gray-600">
              Tasa de cierre exitoso
            </p>
          </div>

          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
            <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Productividad</h3>
            <p className="text-3xl font-bold text-purple-600 mb-1">
              {analytics.tasks.completionRate.toFixed(1)}%
            </p>
            <p className="text-sm text-gray-600">
              Tareas completadas
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};