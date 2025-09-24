export interface Company {
  id: string;
  name: string;
  industry: string;
  size: 'STARTUP' | 'SMALL' | 'MEDIUM' | 'LARGE' | 'ENTERPRISE';
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  country?: string;
  description?: string;
  logo?: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCompanyData {
  name: string;
  industry: string;
  size: 'STARTUP' | 'SMALL' | 'MEDIUM' | 'LARGE' | 'ENTERPRISE';
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  country?: string;
  description?: string;
  logo?: string;
}

export const COMPANY_SIZES = [
  { value: 'STARTUP', label: 'Startup (1-10)', color: 'bg-purple-100 text-purple-800' },
  { value: 'SMALL', label: 'Pequeña (11-50)', color: 'bg-blue-100 text-blue-800' },
  { value: 'MEDIUM', label: 'Mediana (51-200)', color: 'bg-green-100 text-green-800' },
  { value: 'LARGE', label: 'Grande (201-1000)', color: 'bg-orange-100 text-orange-800' },
  { value: 'ENTERPRISE', label: 'Empresa (1000+)', color: 'bg-red-100 text-red-800' },
] as const;

export const INDUSTRIES = [
  'Tecnología',
  'Finanzas',
  'Salud',
  'Educación',
  'Retail',
  'Manufactura',
  'Servicios',
  'Inmobiliaria',
  'Construcción',
  'Agricultura',
  'Transporte',
  'Energía',
  'Telecomunicaciones',
  'Media',
  'Turismo',
  'Otros'
] as const;