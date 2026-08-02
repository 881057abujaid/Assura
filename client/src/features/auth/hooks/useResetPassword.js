import { useState } from 'react'

import { authService } from '../services/auth.service'

export function useResetPassword() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const resetPassword = async (passwordData) => {
    setLoading(true)
    setError(null)
    try {
      const data = await authService.resetPassword(passwordData)
      return data.data
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to reset password.'
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }

  return {
    resetPassword,
    loading,
    error,
  }
}
