import { useState } from 'react'
import { customerService } from '../services/customer.service'

/**
 * Hook for a CUSTOMER to fetch their own full profile
 * (policies with claims, and documents) from GET /customers/me
 */
export function useCustomerProfile() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [profile, setProfile] = useState(null)

  const fetchMyProfile = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await customerService.getMyProfile()
      setProfile(res.data)
      return res.data
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to load your profile.'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { fetchMyProfile, profile, loading, error }
}
