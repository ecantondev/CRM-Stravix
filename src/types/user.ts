import type { UserRole } from './auth';

export interface UserManagement {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  department?: string;
  phone?: string;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  permissions?: string[];
}

export interface CreateUserData {
  email: string;
  name: string;
  role: UserRole;
  department?: string;
  phone?: string;
  avatar?: string;
}

export interface UpdateUserData {
  name?: string;
  role?: UserRole;
  status?: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  department?: string;
  phone?: string;
  avatar?: string;
}

export const USER_STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Activo', color: 'bg-success-100 text-success-800' },
  { value: 'INACTIVE', label: 'Inactivo', color: 'bg-danger-100 text-danger-800' },
  { value: 'PENDING', label: 'Pendiente', color: 'bg-warning-100 text-warning-800' },
] as const;

export const USER_ROLE_OPTIONS = [
  { value: 'ADMIN', label: 'Administrador', color: 'bg-purple-100 text-purple-800', description: 'Acceso completo al sistema' },
  { value: 'MANAGER', label: 'Gerente', color: 'bg-blue-100 text-blue-800', description: 'Gestión de equipo y reportes' },
  { value: 'SALES', label: 'Ventas', color: 'bg-success-100 text-success-800', description: 'Gestión de leads y oportunidades' },
  { value: 'READONLY', label: 'Solo Lectura', color: 'bg-info-100 text-info-800', description: 'Acceso de solo lectura' },
] as const;

export const DEPARTMENTS = [
  'Ventas',
  'Marketing',
  'Soporte',
  'Desarrollo',
  'Administración',
  'Recursos Humanos',
  'Finanzas',
  'Operaciones',
] as const;