import api from '../../../lib/axios'

export const claimService = {
  getClaims: async () => {
    const response = await api.get('/claims')
    return response.data
  },

  getClaimById: async (id) => {
    const response = await api.get(`/claims/${id}`)
    return response.data
  },

  createClaim: async (data) => {
    const response = await api.post('/claims', data)
    return response.data
  },

  updateClaim: async (id, data) => {
    const response = await api.patch(`/claims/${id}`, data)
    return response.data
  },

  reviewClaim: async (id, data) => {
    const response = await api.patch(`/claims/${id}/review`, data)
    return response.data
  },

  deleteClaim: async (id) => {
    const response = await api.delete(`/claims/${id}`)
    return response.data
  },
}
