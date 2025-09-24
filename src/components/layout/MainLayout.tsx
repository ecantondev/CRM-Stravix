import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Dashboard } from '../dashboard/Dashboard';

export const MainLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      
      <main className="flex-1 overflow-auto">
        <Dashboard />
      </main>
    </div>
  );
};