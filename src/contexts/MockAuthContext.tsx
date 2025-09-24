import React, { createContext, useContext, useState } from 'react';
import type { AuthContextType, User } from '../types/auth';

const MockAuthContext = createContext<AuthContextType | undefined>(undefined);

export const useMockAuth = () => {
  const context = useContext(MockAuthContext);
  if (context === undefined) {
    throw new Error('useMockAuth must be used within a MockAuthProvider');
  }
  return context;
};

export const MockAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const signInWithGoogle = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: '1',
      email: 'demo@stravix.io',
      name: 'Usuario Demo',
      role: 'ADMIN',
      status: 'ACTIVE',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    setUser(mockUser);
    setLoading(false);
  };

  const signOut = async () => {
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    signInWithGoogle,
    signOut,
  };

  return <MockAuthContext.Provider value={value}>{children}</MockAuthContext.Provider>;
};