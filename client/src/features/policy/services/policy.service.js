import api from '../../../lib/axios'

export const policyService = {
  getPolicies: async () => {
    const response = await api.get('/policies')
    return response.data
  },

  getPolicyById: async (id) => {
    const response = await api.get(`/policies/${id}`)
    return response.data
  },

  createPolicy: async (data) => {
    const response = await api.post('/policies', data)
    return response.data
  },

  applyPolicy: async (data) => {
    const response = await api.post('/policies/apply', data)
    return response.data
  },

  updatePolicy: async (id, data) => {
    const response = await api.patch(`/policies/${id}`, data)
    return response.data
  },

  deletePolicy: async (id) => {
    const response = await api.delete(`/policies/${id}`)
    return response.data
  },

  // Policy Types APIs
  getPolicyTypes: async () => {
    const response = await api.get('/policy-types')
    return response.data
  },

  getPolicyTypeById: async (id) => {
    const response = await api.get(`/policy-types/${id}`)
    return response.data
  },

  createPolicyType: async (data) => {
    const response = await api.post('/policy-types', data)
    return response.data
  },

  updatePolicyType: async (id, data) => {
    const response = await api.patch(`/policy-types/${id}`, data)
    return response.data
  },

  deletePolicyType: async (id) => {
    const response = await api.delete(`/policy-types/${id}`)
    return response.data
  },
}
