import { Navigate, Outlet } from 'react-router-dom';
import { storage } from '../lib/storage';

/**
 * Route protection wrapper component.
 * Verifies the presence of the authentication token and redirects unauthenticated users.
 */
export function ProtectedRoute({ children }) {
  const token = storage.getAccessToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Render child components if provided, otherwise render the nested Route Outlet
  return children ? children : <Outlet />;
}

export default ProtectedRoute;
