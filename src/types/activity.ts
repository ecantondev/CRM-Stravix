export type ActivityType = 'NOTE' | 'CALL' | 'EMAIL' | 'MEETING' | 'STATUS_CHANGE' | 'DEAL_STAGE_CHANGE' | 'TASK_COMPLETED';

export interface Activity {
  id: string;
  lead_id?: string;
  company_id?: string;
  deal_id?: string;
  contact_id?: string;
  user_id: string;
  type: ActivityType;
  subject?: string;
  content: string;
  duration?: number; // in minutes
  scheduled_at?: string;
  created_at: string;
  user?: {
    name: string;
    avatar?: string;
  };
  lead?: {
    first_name: string;
    last_name: string;
    company: string;
  };
  company?: {
    name: string;
  };
  deal?: {
    title: string;
    value: number;
  };
  contact?: {
    first_name: string;
    last_name: string;
  };
}

export interface CreateActivityData {
  lead_id?: string;
  company_id?: string;
  deal_id?: string;
  contact_id?: string;
  type: ActivityType;
  subject?: string;
  content: string;
  duration?: number;
  scheduled_at?: string;
}

export const ACTIVITY_TYPES = [
  { value: 'NOTE', label: 'Nota', icon: 'FileText', color: 'bg-blue-100 text-blue-800' },
  { value: 'CALL', label: 'Llamada', icon: 'Phone', color: 'bg-green-100 text-green-800' },
  { value: 'EMAIL', label: 'Email', icon: 'Mail', color: 'bg-purple-100 text-purple-800' },
  { value: 'MEETING', label: 'Reunión', icon: 'Calendar', color: 'bg-orange-100 text-orange-800' },
  { value: 'STATUS_CHANGE', label: 'Cambio Estado', icon: 'ArrowRight', color: 'bg-gray-100 text-gray-800' },
  { value: 'DEAL_STAGE_CHANGE', label: 'Cambio Etapa Deal', icon: 'TrendingUp', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'TASK_COMPLETED', label: 'Tarea Completada', icon: 'CheckCircle', color: 'bg-green-100 text-green-800' },
] as const;