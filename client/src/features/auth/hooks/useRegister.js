import { useState } from 'react'

import { authService } from '../services/auth.service'

export function useRegister() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const register = async (formData) => {
    setLoading(true)
    setError(null)
    try {
      const data = await authService.register(formData)
      return data.data
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create account. Please try again.'
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }

  return {
    register,
    loading,
    error,
  }
}
