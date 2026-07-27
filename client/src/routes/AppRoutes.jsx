import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../features/auth/pages/LoginPage';
import AppLayout from '../layouts/AppLayout';
import ProtectedRoute from './ProtectedRoute';
import { 
  Dashboard, 
  Customers, 
  Policies, 
  Claims, 
  PolicyTypes, 
  Payments 
} from '../pages/DummyPages';

/**
 * Global Routing Configuration for Assura App.
 * Handles public paths (Login) and guards protected dashboard layout paths.
 */
export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public auth route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected layout routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<AppLayout />}>
            {/* Index redirecting to /dashboard */}
            <Route index element={<Navigate to="/dashboard" replace />} />
            
            {/* Dashboard and feature metrics */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="customers" element={<Customers />} />
            <Route path="policies" element={<Policies />} />
            <Route path="claims" element={<Claims />} />
            <Route path="policy-types" element={<PolicyTypes />} />
            <Route path="payments" element={<Payments />} />

            {/* Catch-all inner routes to redirect to Dashboard */}
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Route>
        </Route>

        {/* Global Catch-all redirect to index */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
