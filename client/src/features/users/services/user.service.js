import api from '../../../lib/axios'

export const userService = {
  getProfile: async () => {
    const response = await api.get('/users/me')
    return response.data
  },

  updateProfile: async (data) => {
    const response = await api.patch('/users/me', data)
    return response.data
  },

  changePassword: async (data) => {
    const response = await api.patch('/users/change-password', data)
    return response.data
  },

  getUnassignedUsers: async () => {
    const response = await api.get('/users/unassigned-customers')
    return response.data
  },

  getAgents: async () => {
    const response = await api.get('/users/agents')
    return response.data
  },

  completeProfile: async (data) => {
    const response = await api.patch('/customers/profile', data)
    return response.data
  },
}
