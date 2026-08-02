import api from '../../../lib/axios'

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  register: async (data) => {
    const response = await api.post('/auth/register', {
      fullName: data.fullName,
      email: data.email,
      password: data.password,
    })
    return response.data
  },

  logout: async () => {
    const response = await api.post('/auth/logout')
    return response.data
  },

  forgotPassword: async (data) => {
    const response = await api.post('/auth/forgot-password', data)
    return response.data
  },

  resetPassword: async (data) => {
    const response = await api.post('/auth/reset-password', data)
    return response.data
  },
}
