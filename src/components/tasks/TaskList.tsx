import React, { useState } from 'react';
import { CheckCircle, Clock, AlertCircle, User, Calendar, Plus } from 'lucide-react';
import { useTasks } from '../../hooks/useTasks';
import { TaskForm } from './TaskForm';
import { TASK_STATUS_OPTIONS, TASK_PRIORITY_OPTIONS } from '../../types/task';
import type { Task, TaskStatus } from '../../types/task';

interface TaskListProps {
  leadId?: string;
  showCreateButton?: boolean;
}

export const TaskList: React.FC<TaskListProps> = ({ leadId, showCreateButton = true }) => {
  const { tasks, loading, updateTask } = useTasks(leadId);
  const [showTaskForm, setShowTaskForm] = useState(false);

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    try {
      await updateTask(taskId, { status: newStatus });
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const getStatusConfig = (status: string) => {
    return TASK_STATUS_OPTIONS.find(option => option.value === status) || TASK_STATUS_OPTIONS[0];
  };

  const getPriorityConfig = (priority: string) => {
    return TASK_PRIORITY_OPTIONS.find(option => option.value === priority) || TASK_PRIORITY_OPTIONS[1];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showCreateButton && (
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Tareas {leadId ? 'del Lead' : ''}
          </h3>
          <button
            onClick={() => setShowTaskForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nueva Tarea
          </button>
        </div>
      )}

      {tasks.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No hay tareas registradas</p>
          {showCreateButton && (
            <button
              onClick={() => setShowTaskForm(true)}
              className="mt-3 text-blue-600 hover:text-blue-800 font-medium"
            >
              Crear primera tarea
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => {
            const statusConfig = getStatusConfig(task.status);
            const priorityConfig = getPriorityConfig(task.priority);
            const isTaskOverdue = task.due_date && isOverdue(task.due_date) && task.status !== 'COMPLETED';

            return (
              <div
                key={task.id}
                className={`bg-white border rounded-lg p-4 hover:shadow-md transition-shadow ${
                  isTaskOverdue ? 'border-red-200 bg-red-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900">{task.title}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityConfig.color}`}>
                        {priorityConfig.label}
                      </span>
                    </div>
                    
                    {task.description && (
                      <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                    )}

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      {task.lead && (
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{task.lead.first_name} {task.lead.last_name}</span>
                        </div>
                      )}
                      
                      {task.due_date && (
                        <div className={`flex items-center gap-1 ${
                          isTaskOverdue ? 'text-red-600 font-medium' : ''
                        }`}>
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(task.due_date)}</span>
                          {isTaskOverdue && <AlertCircle className="w-3 h-3" />}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task.id, e.target.value as TaskStatus)}
                      className={`text-xs font-medium rounded-full px-2 py-1 border-0 focus:ring-2 focus:ring-blue-500 ${statusConfig.color}`}
                    >
                      {TASK_STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>

                    {task.status === 'COMPLETED' && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <span>Asignado a:</span>
                    <span className="font-medium">{task.assigned_user?.name}</span>
                  </div>
                  
                  <span>Creado: {formatDate(task.created_at)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <TaskForm
        isOpen={showTaskForm}
        onClose={() => setShowTaskForm(false)}
        leadId={leadId}
        onTaskCreated={() => setShowTaskForm(false)}
      />
    </div>
  );
};