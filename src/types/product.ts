export type ProductType = 'PRODUCT' | 'SERVICE';

export interface Product {
  id: string;
  name: string;
  description?: string;
  type: ProductType;
  category: string;
  price: number;
  currency: string;
  is_active: boolean;
  sku?: string;
  unit?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProductData {
  name: string;
  description?: string;
  type: ProductType;
  category: string;
  price: number;
  currency: string;
  is_active: boolean;
  sku?: string;
  unit?: string;
}

export const PRODUCT_CATEGORIES = [
  'Software',
  'Consultoría',
  'Desarrollo',
  'Marketing Digital',
  'Diseño',
  'Capacitación',
  'Soporte Técnico',
  'Licencias',
  'Hardware',
  'Otros'
] as const;

export const PRODUCT_UNITS = [
  'Unidad',
  'Hora',
  'Día',
  'Mes',
  'Año',
  'Proyecto',
  'Licencia',
  'Usuario'
] as const;