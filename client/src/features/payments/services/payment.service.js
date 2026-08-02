import api from '../../../lib/axios'

export const paymentService = {
  getPayments: async () => {
    const response = await api.get('/payments')
    return response.data
  },

  getPaymentById: async (id) => {
    const response = await api.get(`/payments/${id}`)
    return response.data
  },

  getPaymentsByPolicy: async (policyId) => {
    const response = await api.get(`/payments/policy/${policyId}`)
    return response.data
  },

  createPayment: async (data) => {
    const response = await api.post('/payments', data)
    return response.data
  },

  customerPay: async (data) => {
    const response = await api.post('/payments/customer-pay', data)
    return response.data
  },



  deletePayment: async (id) => {
    const response = await api.delete(`/payments/${id}`)
    return response.data
  },
}
