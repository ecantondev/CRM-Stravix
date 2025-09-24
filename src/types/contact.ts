export interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  position?: string;
  department?: string;
  company_id?: string;
  lead_id?: string;
  is_primary: boolean;
  linkedin_url?: string;
  notes?: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
  company?: {
    name: string;
    industry: string;
  };
  lead?: {
    first_name: string;
    last_name: string;
    company: string;
  };
}

export interface CreateContactData {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  position?: string;
  department?: string;
  company_id?: string;
  lead_id?: string;
  is_primary: boolean;
  linkedin_url?: string;
  notes?: string;
}