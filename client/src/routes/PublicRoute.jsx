import { Navigate } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'
import { ROUTES } from '../config/routes'

export function PublicRoute({ children }) {
  const { user } = useAuth()

  if (user) {
    return <Navigate to={ROUTES.DASHBOARD} replace />
  }

  return children
}

export default PublicRoute
