import { useState } from 'react'

import { claimService } from '../services/claim.service'
import { documentService } from '../../documents/services/document.service'

export function useClaimDetail() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [claim, setClaim] = useState(null)
  const [documents, setDocuments] = useState([])

  const fetchClaimDetail = async (id) => {
    setLoading(true)
    setError(null)
    try {
      const [claimData, documentsData] = await Promise.all([
        claimService.getClaimById(id),
        documentService.getDocumentsByClaim(id).catch(() => ({ data: [] }))
      ])

      setClaim(claimData.data)
      setDocuments(documentsData.data || [])

      return { claim: claimData.data, documents: documentsData.data }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch claim details.'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    fetchClaimDetail,
    claim,
    documents,
    loading,
    error,
  }
}
