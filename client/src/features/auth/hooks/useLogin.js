import { useState } from 'react'

import { authService } from '../services/auth.service'

export function useLogin() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const login = async (credentials) => {
    setLoading(true)
    setError(null)
    try {
      const data = await authService.login(credentials)
      return data.data
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to sign in. Please check your credentials.'
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }

  return {
    login,
    loading,
    error,
  }
}
