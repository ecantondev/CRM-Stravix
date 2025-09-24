export type ProjectStatus = 'PLANNING' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  start_date?: string;
  end_date?: string;
  budget?: number;
  currency: string;
  company_id: string;
  deal_id?: string;
  manager_id: string;
  created_at: string;
  updated_at: string;
  company?: {
    name: string;
    industry: string;
  };
  deal?: {
    title: string;
    value: number;
  };
  manager?: {
    name: string;
    avatar?: string;
  };
}

export interface CreateProjectData {
  name: string;
  description?: string;
  status: ProjectStatus;
  start_date?: string;
  end_date?: string;
  budget?: number;
  currency: string;
  company_id: string;
  deal_id?: string;
  manager_id: string;
}

export const PROJECT_STATUS_OPTIONS = [
  { value: 'PLANNING', label: 'Planificación', color: 'bg-blue-100 text-blue-800' },
  { value: 'IN_PROGRESS', label: 'En Progreso', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'ON_HOLD', label: 'En Pausa', color: 'bg-orange-100 text-orange-800' },
  { value: 'COMPLETED', label: 'Completado', color: 'bg-green-100 text-green-800' },
  { value: 'CANCELLED', label: 'Cancelado', color: 'bg-red-100 text-red-800' },
] as const;