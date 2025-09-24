export type LeadStatus = 'NEW' | 'CONTACTED' | 'IN_CONVERSATION' | 'MEETING' | 'CLOSED';

export interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  title: string;
  company: string;
  linkedin_url: string;
  note?: string;
  status: LeadStatus;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateLeadData {
  first_name: string;
  last_name: string;
  title: string;
  company: string;
  linkedin_url: string;
  note?: string;
  status: LeadStatus;
}

export const LEAD_STATUS_OPTIONS = [
  { value: 'NEW', label: 'Nuevo', color: 'bg-gray-100 text-gray-800' },
  { value: 'CONTACTED', label: 'Contactado', color: 'bg-blue-100 text-blue-800' },
  { value: 'IN_CONVERSATION', label: 'En Conversación', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'MEETING', label: 'Cita Agendada', color: 'bg-purple-100 text-purple-800' },
  { value: 'CLOSED', label: 'Cerrado', color: 'bg-green-100 text-green-800' },
] as const;