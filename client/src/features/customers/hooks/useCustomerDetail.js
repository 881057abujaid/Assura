import { useState } from 'react'

import { customerService } from '../services/customer.service'
import { policyService } from '../../policy/services/policy.service'
import { documentService } from '../../documents/services/document.service'

export function useCustomerDetail() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [customer, setCustomer] = useState(null)
  const [policies, setPolicies] = useState([])
  const [documents, setDocuments] = useState([])

  const fetchCustomerDetail = async (id) => {
    setLoading(true)
    setError(null)
    try {
      const [customerData, policiesData, documentsData] = await Promise.all([
        customerService.getCustomerById(id),
        policyService.getPolicies().catch(() => ({ data: [] })),
        documentService.getDocumentsByCustomer(id).catch(() => ({ data: [] }))
      ])

      setCustomer(customerData.data)
      
      // Filter policies belonging to this customer
      const filteredPolicies = (policiesData.data || []).filter(
        (p) => p.customerId === id
      )
      setPolicies(filteredPolicies)
      
      setDocuments(documentsData.data || [])
      
      return { customer: customerData.data, policies: filteredPolicies, documents: documentsData.data }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch customer details.'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    fetchCustomerDetail,
    customer,
    policies,
    documents,
    loading,
    error,
  }
}
