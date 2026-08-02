import { useState } from 'react'

import { claimService } from '../services/claim.service'

export function useClaims() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [claims, setClaims] = useState([])

  const fetchClaims = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await claimService.getClaims()
      setClaims(data.data)
      return data
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch claims.'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteClaimRecord = async (id) => {
    setLoading(true)
    setError(null)
    try {
      const data = await claimService.deleteClaim(id)
      setClaims((prev) => prev.filter((c) => c.id !== id))
      return data
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete claim.'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    fetchClaims,
    deleteClaimRecord,
    claims,
    loading,
    error,
  }
}
