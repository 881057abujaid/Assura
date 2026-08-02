import { useState } from 'react'

import { authService } from '../services/auth.service'

export function useForgotPassword() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const forgotPassword = async (emailData) => {
    setLoading(true)
    setError(null)
    try {
      const data = await authService.forgotPassword(emailData)
      return data.data
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to send password reset link.'
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }

  return {
    forgotPassword,
    loading,
    error,
  }
}
