import { Navigate } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'
import { ROUTES } from '../config/routes'

export function ProtectedRoute({ children, allowIncompleteProfile = false }) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  if (user?.role === 'CUSTOMER' && !allowIncompleteProfile) {
    if (!user.customer || !user.customer.profileCompleted) {
      return <Navigate to={ROUTES.COMPLETE_PROFILE} replace />
    }
  }

  return children
}

export default ProtectedRoute;
