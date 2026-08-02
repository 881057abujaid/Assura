import { useState } from 'react'

import { claimService } from '../services/claim.service'

export function useClaimForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const createClaimRecord = async (formData) => {
    setLoading(true)
    setError(null)
    try {
      const data = await claimService.createClaim(formData)
      return data
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to file claim request.'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateClaimRecord = async (id, formData) => {
    setLoading(true)
    setError(null)
    try {
      const data = await claimService.updateClaim(id, formData)
      return data
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update claim.'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    createClaimRecord,
    updateClaimRecord,
    loading,
    error,
  }
}
