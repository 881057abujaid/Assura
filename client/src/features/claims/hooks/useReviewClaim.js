import { useState } from 'react'

import { claimService } from '../services/claim.service'

export function useReviewClaim() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const submitClaimReview = async (id, reviewData) => {
    setLoading(true)
    setError(null)
    try {
      const data = await claimService.reviewClaim(id, reviewData)
      return data
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to submit claim review.'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    submitClaimReview,
    loading,
    error,
  }
}
