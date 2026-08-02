import { useState } from 'react'

import { customerService } from '../services/customer.service'

export function useCustomers() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [customers, setCustomers] = useState([])

  const fetchCustomers = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await customerService.getCustomers()
      setCustomers(data.data)
      return data
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch customers.'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteCustomerRecord = async (id) => {
    setLoading(true)
    setError(null)
    try {
      const data = await customerService.deleteCustomer(id)
      setCustomers((prev) => prev.filter((c) => c.id !== id))
      return data
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete customer.'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    fetchCustomers,
    deleteCustomerRecord,
    customers,
    loading,
    error,
  }
}
