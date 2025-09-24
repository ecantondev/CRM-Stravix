export type UserRole = 'ADMIN' | 'MANAGER' | 'SALES' | 'READONLY';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  department?: string;
  phone?: string;
  created_at: string;
  last_login_at?: string;
  updated_at: string;
  created_by?: string;
}

export interface UserManagement extends User {
  permissions?: string[];
}
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}