import api from '../../../lib/axios'

export const customerService = {
  getCustomers: async () => {
    const response = await api.get('/customers')
    return response.data
  },

  getCustomerById: async (id) => {
    const response = await api.get(`/customers/${id}`)
    return response.data
  },

  getMyProfile: async () => {
    const response = await api.get('/customers/me')
    return response.data
  },

  createCustomer: async (data) => {
    const response = await api.post('/customers', data)
    return response.data
  },

  updateCustomer: async (id, data) => {
    const response = await api.patch(`/customers/${id}`, data)
    return response.data
  },

  deleteCustomer: async (id) => {
    const response = await api.delete(`/customers/${id}`)
    return response.data
  },
}
