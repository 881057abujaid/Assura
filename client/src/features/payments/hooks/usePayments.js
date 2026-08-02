import { useState } from 'react'

import { paymentService } from '../services/payment.service'

export function usePayments() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [payments, setPayments] = useState([])

  const fetchPayments = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await paymentService.getPayments()
      setPayments(data.data)
      return data
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch payments.'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deletePaymentRecord = async (id) => {
    setLoading(true)
    setError(null)
    try {
      await paymentService.deletePayment(id)
      setPayments((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete payment.'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    fetchPayments,
    deletePaymentRecord,
    payments,
    loading,
    error,
  }
}
