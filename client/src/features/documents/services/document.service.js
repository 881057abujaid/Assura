import api from '../../../lib/axios'

export const documentService = {
  uploadDocument: async (formData) => {
    const response = await api.post('/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  getDocumentById: async (id) => {
    const response = await api.get(`/documents/${id}`)
    return response.data
  },

  getDocumentsByCustomer: async (customerId) => {
    const response = await api.get(`/documents/customers/${customerId}`)
    return response.data
  },

  getDocumentsByClaim: async (claimId) => {
    const response = await api.get(`/documents/claims/${claimId}`)
    return response.data
  },

  deleteDocument: async (id) => {
    const response = await api.delete(`/documents/${id}`)
    return response.data
  },
}
