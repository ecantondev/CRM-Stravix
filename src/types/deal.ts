export type DealStage = 'PROSPECTING' | 'QUALIFICATION' | 'PROPOSAL' | 'NEGOTIATION' | 'CLOSED_WON' | 'CLOSED_LOST';

export interface Deal {
  id: string;
  title: string;
  description?: string;
  value: number;
  currency: string;
  probability: number;
  stage: DealStage;
  expected_close_date?: string;
  actual_close_date?: string;
  company_id?: string;
  lead_id?: string;
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
  deal_products?: DealProduct[];
}

export interface DealProduct {
  id: string;
  deal_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  discount: number;
  total: number;
  product?: {
    name: string;
    type: 'PRODUCT' | 'SERVICE';
  };
}

export interface CreateDealData {
  title: string;
  description?: string;
  value: number;
  currency: string;
  probability: number;
  stage: DealStage;
  expected_close_date?: string;
  company_id?: string;
  lead_id?: string;
}

export const DEAL_STAGES = [
  { value: 'PROSPECTING', label: 'Prospección', color: 'bg-gray-100 text-gray-800', probability: 10 },
  { value: 'QUALIFICATION', label: 'Calificación', color: 'bg-blue-100 text-blue-800', probability: 25 },
  { value: 'PROPOSAL', label: 'Propuesta', color: 'bg-yellow-100 text-yellow-800', probability: 50 },
  { value: 'NEGOTIATION', label: 'Negociación', color: 'bg-orange-100 text-orange-800', probability: 75 },
  { value: 'CLOSED_WON', label: 'Cerrado Ganado', color: 'bg-green-100 text-green-800', probability: 100 },
  { value: 'CLOSED_LOST', label: 'Cerrado Perdido', color: 'bg-red-100 text-red-800', probability: 0 },
] as const;

export const CURRENCIES = [
  { value: 'USD', label: 'USD ($)', symbol: '$' },
  { value: 'EUR', label: 'EUR (€)', symbol: '€' },
  { value: 'MXN', label: 'MXN ($)', symbol: '$' },
  { value: 'COP', label: 'COP ($)', symbol: '$' },
  { value: 'ARS', label: 'ARS ($)', symbol: '$' },
] as const;