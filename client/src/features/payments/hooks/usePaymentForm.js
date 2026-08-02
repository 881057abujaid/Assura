import { useState } from 'react'

import { paymentService } from '../services/payment.service'

export function usePaymentForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const createPaymentRecord = async (formData) => {
    setLoading(true)
    setError(null)
    try {
      const data = await paymentService.createPayment(formData)
      return data
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to record premium payment.'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    createPaymentRecord,
    loading,
    error,
  }
}
