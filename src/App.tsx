import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { isSupabaseConfigured } from './config/supabase';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Conditional imports based on Supabase configuration
const AuthProvider = isSupabaseConfigured 
  ? React.lazy(() => import('./contexts/SupabaseAuthContext').then(m => ({ default: m.SupabaseAuthProvider })))
  : React.lazy(() => import('./contexts/MockAuthContext').then(m => ({ default: m.MockAuthProvider })));

const LoginPage = isSupabaseConfigured
  ? React.lazy(() => import('./components/auth/SupabaseLoginPage').then(m => ({ default: m.SupabaseLoginPage })))
  : React.lazy(() => import('./components/auth/LoginPage').then(m => ({ default: m.LoginPage })));

// Import other components
import { SupabaseSetup } from './components/setup/SupabaseSetup';
import { PendingApprovalPage } from './components/auth/PendingApprovalPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './components/dashboard/Dashboard';
import { LeadsPage } from './components/pages/LeadsPage';
import { LeadForm } from './components/leads/LeadForm';
import { LeadDetail } from './components/leads/LeadDetail';
import { CompaniesPage } from './components/companies/CompaniesPage';
import { CompanyForm } from './components/companies/CompanyForm';
import { DealsPage } from './components/deals/DealsPage';
import { DealsKanban } from './components/deals/DealsKanban';
import { DealForm } from './components/deals/DealForm';
import { ContactsPage } from './components/contacts/ContactsPage';
import { ContactForm } from './components/contacts/ContactForm';
import { ProjectsPage } from './components/projects/ProjectsPage';
import { ProjectForm } from './components/projects/ProjectForm';
import { ProductsPage } from './components/products/ProductsPage';
import { ProductForm } from './components/products/ProductForm';
import { TasksPage } from './components/pages/TasksPage';
import { AnalyticsPage } from './components/analytics/AnalyticsPage';
import { SettingsPage } from './components/pages/SettingsPage';
import { UserProfile } from './components/profile/UserProfile';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { SystemSettings } from './components/admin/SystemSettings';
import { UserManagement } from './components/admin/UserManagement';
import { ProductionChecklist } from './components/setup/ProductionChecklist';

// Loading component
const LoadingScreen: React.FC = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Cargando aplicación...</p>
    </div>
  </div>
);


// Main App component with conditional rendering
const AppContent: React.FC = () => {
  // If Supabase is not configured, show setup page
  if (!isSupabaseConfigured) {
    return <SupabaseSetup />;
  }

  // Use Suspense for lazy loading
  return (
    <React.Suspense fallback={<LoadingScreen />}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </React.Suspense>
  );
};

// Routes component
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route 
        path="/login"
        element={
          <React.Suspense fallback={<LoadingScreen />}>
            <LoginPage />
          </React.Suspense>
        }
      />
      
      <Route 
        path="/pending"
        element={<PendingApprovalPage />}
      />
      
      <Route 
        path="/app/*" 
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="companies" element={<CompaniesPage />} />
        <Route path="companies/new" element={<CompanyForm />} />
        <Route path="contacts" element={<ContactsPage />} />
        <Route path="contacts/new" element={<ContactForm />} />
        <Route path="leads" element={<LeadsPage />} />
        <Route path="leads/new" element={<LeadForm />} />
        <Route path="leads/:id" element={<LeadDetail />} />
        <Route path="deals" element={<DealsPage />} />
        <Route path="deals/kanban" element={<DealsKanban />} />
        <Route path="deals/new" element={<DealForm />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/new" element={<ProjectForm />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/new" element={<ProductForm />} />
        <Route path="tasks" element={<TasksPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="admin" element={<AdminDashboard />} />
        <Route path="admin/users" element={<UserManagement />} />
        <Route path="admin/settings" element={<SystemSettings />} />
        <Route path="admin/checklist" element={<ProductionChecklist />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      
      <Route 
        path="/" 
        element={<Navigate to="/login" replace />} 
      />
    </Routes>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AppContent />
      </Router>
    </ErrorBoundary>
  );
}

export default App;