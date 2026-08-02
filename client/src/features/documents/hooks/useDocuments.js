import { useState } from 'react'

import { documentService } from '../services/document.service'

export function useDocuments() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [documents, setDocuments] = useState([])

  const fetchCustomerDocuments = async (customerId) => {
    setLoading(true)
    setError(null)
    try {
      const data = await documentService.getDocumentsByCustomer(customerId)
      setDocuments(data.data || [])
      return data
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch customer documents.'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const fetchClaimDocuments = async (claimId) => {
    setLoading(true)
    setError(null)
    try {
      const data = await documentService.getDocumentsByClaim(claimId)
      setDocuments(data.data || [])
      return data
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch claim documents.'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteDocumentRecord = async (id) => {
    setLoading(true)
    setError(null)
    try {
      const data = await documentService.deleteDocument(id)
      setDocuments((prev) => prev.filter((d) => d.id !== id))
      return data
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete document.'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    fetchCustomerDocuments,
    fetchClaimDocuments,
    deleteDocumentRecord,
    documents,
    loading,
    error,
  }
}
export default useDocuments
