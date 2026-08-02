import { useState } from 'react'

import { policyService } from '../services/policy.service'
import { paymentService } from '../../payments/services/payment.service'
import { claimService } from '../../claims/services/claim.service'

export function usePolicyDetail() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [policy, setPolicy] = useState(null)
  const [payments, setPayments] = useState([])
  const [claims, setClaims] = useState([])

  const fetchPolicyDetail = async (id) => {
    setLoading(true)
    setError(null)
    try {
      const [policyData, paymentsData, claimsData] = await Promise.all([
        policyService.getPolicyById(id),
        paymentService.getPaymentsByPolicy(id).catch(() => ({ data: [] })),
        claimService.getClaims().catch(() => ({ data: [] }))
      ])

      setPolicy(policyData.data)
      setPayments(paymentsData.data || [])
      
      const policyClaims = (claimsData.data || []).filter((c) => c.policyId === id)
      setClaims(policyClaims)

      return { policy: policyData.data, payments: paymentsData.data, claims: policyClaims }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch policy details.'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    fetchPolicyDetail,
    policy,
    payments,
    claims,
    loading,
    error,
  }
}
