import { useState } from 'react'

import { policyService } from '../services/policy.service'

export function usePolicyForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const createPolicy = async (formData) => {
    setLoading(true)
    setError(null)
    try {
      const data = await policyService.createPolicy(formData)
      return data
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create policy.'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updatePolicy = async (id, formData) => {
    setLoading(true)
    setError(null)
    try {
      const data = await policyService.updatePolicy(id, formData)
      return data
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update policy.'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    createPolicy,
    updatePolicy,
    loading,
    error,
  }
}
