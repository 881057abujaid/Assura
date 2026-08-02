import { useState } from 'react'

import { customerService } from '../services/customer.service'

export function useCustomerForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const createCustomer = async (formData) => {
    setLoading(true)
    setError(null)
    try {
      const data = await customerService.createCustomer(formData)
      return data
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create customer.'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateCustomer = async (id, formData) => {
    setLoading(true)
    setError(null)
    try {
      const data = await customerService.updateCustomer(id, formData)
      return data
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update customer.'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    createCustomer,
    updateCustomer,
    loading,
    error,
  }
}
