import { useState } from 'react'

import { policyService } from '../services/policy.service'

export function usePolicyTypes() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [policyTypes, setPolicyTypes] = useState([])

  const fetchPolicyTypes = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await policyService.getPolicyTypes()
      setPolicyTypes(data.data)
      return data
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch policy types.'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const createPolicyTypeRecord = async (formData) => {
    setLoading(true)
    setError(null)
    try {
      const data = await policyService.createPolicyType(formData)
      setPolicyTypes((prev) => [...prev, data.data])
      return data
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create policy type.'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updatePolicyTypeRecord = async (id, formData) => {
    setLoading(true)
    setError(null)
    try {
      const data = await policyService.updatePolicyType(id, formData)
      setPolicyTypes((prev) =>
        prev.map((t) => (t.id === id ? data.data : t))
      )
      return data
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update policy type.'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deletePolicyTypeRecord = async (id) => {
    setLoading(true)
    setError(null)
    try {
      const data = await policyService.deletePolicyType(id)
      setPolicyTypes((prev) => prev.filter((t) => t.id !== id))
      return data
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete policy type.'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    fetchPolicyTypes,
    createPolicyTypeRecord,
    updatePolicyTypeRecord,
    deletePolicyTypeRecord,
    policyTypes,
    loading,
    error,
  }
}
