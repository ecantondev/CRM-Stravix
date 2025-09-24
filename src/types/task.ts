export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Task {
  id: string;
  title: string;
  description?: string;
  lead_id?: string;
  assigned_to: string;
  created_by: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  lead?: {
    first_name: string;
    last_name: string;
    company: string;
  };
  assigned_user?: {
    name: string;
    avatar?: string;
  };
  creator?: {
    name: string;
    avatar?: string;
  };
}

export interface CreateTaskData {
  title: string;
  description?: string;
  lead_id?: string;
  assigned_to: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: string;
}

export const TASK_STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pendiente', color: 'bg-gray-100 text-gray-800' },
  { value: 'IN_PROGRESS', label: 'En Progreso', color: 'bg-blue-100 text-blue-800' },
  { value: 'COMPLETED', label: 'Completada', color: 'bg-green-100 text-green-800' },
  { value: 'CANCELLED', label: 'Cancelada', color: 'bg-red-100 text-red-800' },
] as const;

export const TASK_PRIORITY_OPTIONS = [
  { value: 'LOW', label: 'Baja', color: 'bg-gray-100 text-gray-800' },
  { value: 'MEDIUM', label: 'Media', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'HIGH', label: 'Alta', color: 'bg-orange-100 text-orange-800' },
  { value: 'URGENT', label: 'Urgente', color: 'bg-red-100 text-red-800' },
] as const;