import { useState } from 'react'

import { policyService } from '../services/policy.service'

export function usePolicies() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [policies, setPolicies] = useState([])

  const fetchPolicies = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await policyService.getPolicies()
      setPolicies(data.data)
      return data
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch policies.'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deletePolicyRecord = async (id) => {
    setLoading(true)
    setError(null)
    try {
      const data = await policyService.deletePolicy(id)
      setPolicies((prev) => prev.filter((p) => p.id !== id))
      return data
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete policy.'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updatePolicyRecord = async (id, data) => {
    setLoading(true)
    setError(null)
    try {
      const res = await policyService.updatePolicy(id, data)
      fetchPolicies()
      return res
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update policy.'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    fetchPolicies,
    deletePolicyRecord,
    updatePolicyRecord,
    policies,
    loading,
    error,
  }
}
