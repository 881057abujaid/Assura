import { Navigate, useLocation } from 'react-router-dom'
import { storage } from '../../../lib/storage'

export function CustomerProfileGuard({ children }) {
  const user = storage.getUser()
  const location = useLocation()

  if (user?.role === 'CUSTOMER') {
    if (!user.customer || !user.customer.profileCompleted) {
      if (location.pathname !== '/complete-profile') {
        return <Navigate to="/complete-profile" replace />
      }
    }
  }

  return children
}

export default CustomerProfileGuard
