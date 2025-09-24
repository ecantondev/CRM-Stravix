import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, AlertTriangle, Info, Clock } from 'lucide-react';
import { useTasks } from '../../hooks/useTasks';
import { useLeads } from '../../hooks/useLeads';

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

export const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { tasks } = useTasks();
  const { leads } = useLeads();

  useEffect(() => {
    const generateNotifications = () => {
      const newNotifications: Notification[] = [];

      // Overdue tasks notifications
      const overdueTasks = tasks.filter(task => 
        task.due_date && 
        new Date(task.due_date) < new Date() && 
        task.status !== 'COMPLETED'
      );

      overdueTasks.forEach(task => {
        newNotifications.push({
          id: `overdue-${task.id}`,
          type: 'warning',
          title: 'Tarea Vencida',
          message: `La tarea "${task.title}" está vencida`,
          timestamp: new Date(task.due_date!),
          read: false,
          actionUrl: `/app/tasks`
        });
      });

      // Tasks due today
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const tasksDueToday = tasks.filter(task => 
        task.due_date && 
        new Date(task.due_date) >= todayStart &&
        new Date(task.due_date) <= today &&
        task.status !== 'COMPLETED'
      );

      tasksDueToday.forEach(task => {
        newNotifications.push({
          id: `due-today-${task.id}`,
          type: 'info',
          title: 'Tarea Vence Hoy',
          message: `La tarea "${task.title}" vence hoy`,
          timestamp: new Date(),
          read: false,
          actionUrl: `/app/tasks`
        });
      });

      // New leads in last 24 hours
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const recentLeads = leads.filter(lead => 
        new Date(lead.created_at) >= yesterday
      );

      if (recentLeads.length > 0) {
        newNotifications.push({
          id: `new-leads-${Date.now()}`,
          type: 'success',
          title: 'Nuevos Leads',
          message: `${recentLeads.length} nuevo${recentLeads.length > 1 ? 's' : ''} lead${recentLeads.length > 1 ? 's' : ''} agregado${recentLeads.length > 1 ? 's' : ''}`,
          timestamp: new Date(),
          read: false,
          actionUrl: `/app/leads`
        });
      }

      // Leads without activity for 7 days
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const staleLeads = leads.filter(lead => 
        new Date(lead.updated_at) <= weekAgo &&
        lead.status !== 'CLOSED' &&
        lead.status !== 'CANCELLED'
      );

      if (staleLeads.length > 0) {
        newNotifications.push({
          id: `stale-leads-${Date.now()}`,
          type: 'warning',
          title: 'Leads Sin Actividad',
          message: `${staleLeads.length} lead${staleLeads.length > 1 ? 's' : ''} sin actividad por más de 7 días`,
          timestamp: new Date(),
          read: false,
          actionUrl: `/app/leads`
        });
      }

      setNotifications(newNotifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
    };

    generateNotifications();
  }, [tasks, leads]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return 'ahora';
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors relative"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Notificaciones</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-orange-600 hover:text-orange-800 font-medium"
                  >
                    Marcar todas como leídas
                  </button>
                )}
              </div>
            </div>

            <div className="overflow-y-auto max-h-80">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No hay notificaciones</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 transition-colors ${
                        !notification.read ? 'bg-orange-50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {notification.title}
                            </h4>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">
                                {formatTime(notification.timestamp)}
                              </span>
                              <button
                                onClick={() => removeNotification(notification.id)}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {notification.message}
                          </p>
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs text-orange-600 hover:text-orange-800 font-medium"
                            >
                              Marcar como leída
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};