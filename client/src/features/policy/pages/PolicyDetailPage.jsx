import { useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { FileText, CreditCard, LifeBuoy, ArrowLeft, Plus } from 'lucide-react'

import { storage } from '../../../lib/storage'

import { Card, Alert, Spinner, Button, Badge } from '../../../components/ui'

import { usePolicyDetail } from '../hooks/usePolicyDetail'
import { ROUTES } from '../../../config/routes'

export function PolicyDetailPage() {
  const { policyId } = useParams()
  const navigate = useNavigate()
  const { fetchPolicyDetail, policy, payments, claims, loading, error } = usePolicyDetail()

  const currentUser = storage.getUser()
  const isAgentOrAdmin = currentUser?.role === 'ADMIN' || currentUser?.role === 'AGENT'

  useEffect(() => {
    fetchPolicyDetail(policyId)
  }, [policyId])

  const getStatusVariant = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'success'
      case 'EXPIRED':
        return 'error'
      case 'CANCELLED':
        return 'error'
      default:
        return 'warning'
    }
  }

  const getClaimStatusVariant = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'success'
      case 'REJECTED':
        return 'error'
      case 'PENDING':
        return 'warning'
      default:
        return 'warning'
    }
  }

  if (loading && !policy) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Link to="/policies" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Policies
        </Link>
        <Alert variant="error">{error}</Alert>
      </div>
    )
  }

  if (!policy) return null

  return (
    <div className="space-y-6">
      {/* Header Breadcrumbs */}
      <div>
        <Link to="/policies" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to Policies
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-text-primary font-mono">{policy.policyNumber}</h1>
            <p className="text-text-secondary">Agreement Details & Lifecycle Ledger</p>
          </div>
          {isAgentOrAdmin && (
            <div className="flex flex-wrap gap-2">
              <Link to={`/payments/new?policyId=${policy.id}`}>
                <Button variant="secondary" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Record Payment
                </Button>
              </Link>
              <Link to={`/claims/new?policyId=${policy.id}`}>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  File Claim
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Grid panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side: Policy Details summary card */}
        <Card className="hover:border-border-custom md:col-span-1 space-y-6">
          <div className="pb-4 border-b border-border-custom flex items-center justify-between">
            <h2 className="text-lg font-bold text-text-primary">Policy Information</h2>
            <Badge variant={getStatusVariant(policy.status)}>
              {policy.status}
            </Badge>
          </div>

          <div className="space-y-4 text-sm text-text-primary">
            <div>
              <span className="text-xs text-text-secondary uppercase block font-semibold">Customer Account</span>
              <Link to={`/customers/${policy.customerId}`} className="text-primary hover:underline font-semibold">
                {policy.customer?.fullName || 'N/A'}
              </Link>
            </div>
            <div>
              <span className="text-xs text-text-secondary uppercase block font-semibold">Policy Type</span>
              <span className="font-medium">{policy.policyType?.name}</span>
            </div>
            <div>
              <span className="text-xs text-text-secondary uppercase block font-semibold">Premium Amount</span>
              <span className="font-mono font-semibold">${parseFloat(policy.premiumAmount).toLocaleString()}</span>
            </div>
            <div>
              <span className="text-xs text-text-secondary uppercase block font-semibold">Coverage Limit</span>
              <span className="font-mono font-semibold">${parseFloat(policy.coverageAmount).toLocaleString()}</span>
            </div>
            <div>
              <span className="text-xs text-text-secondary uppercase block font-semibold">Duration Period</span>
              <span>
                {new Date(policy.startDate).toLocaleDateString()} - {new Date(policy.endDate).toLocaleDateString()}
              </span>
            </div>
            {policy.description && (
              <div>
                <span className="text-xs text-text-secondary uppercase block font-semibold">Description</span>
                <p className="text-text-secondary mt-1 leading-relaxed">{policy.description}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Right Side: Linked premium records and claims */}
        <div className="md:col-span-2 space-y-6">
          {/* Payment Ledger */}
          <Card className="hover:border-border-custom">
            <div className="flex items-center gap-2 pb-3 border-b border-border-custom mb-4">
              <CreditCard className="h-5 w-5 text-primary" strokeWidth={2} />
              <h2 className="text-lg font-bold text-text-primary">Premium Payment Ledger</h2>
              <span className="ml-auto text-xs bg-slate-100 px-2 py-0.5 rounded font-bold text-text-secondary font-mono">
                {payments.length}
              </span>
            </div>

            {payments.length === 0 ? (
              <div className="text-center py-6 text-sm text-text-secondary">
                No premium collections recorded yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="text-xs font-semibold text-text-secondary uppercase bg-slate-50/50 border-b border-border-custom">
                      <th className="py-2 px-3">Date</th>
                      <th className="py-2 px-3">Amount</th>
                      <th className="py-2 px-3">Method</th>
                      <th className="py-2 px-3">Transaction ID</th>
                      <th className="py-2 px-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-custom">
                    {payments.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="py-3 px-3">
                          {new Date(p.paymentDate).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-3 font-mono font-medium">
                          ${parseFloat(p.amount).toLocaleString()}
                        </td>
                        <td className="py-3 px-3 uppercase text-xs">
                          {p.paymentMethod.replace('_', ' ')}
                        </td>
                        <td className="py-3 px-3 font-mono text-xs text-text-secondary">
                          {p.transactionId || 'N/A'}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <Badge variant={p.status === 'PAID' ? 'success' : p.status === 'PENDING' ? 'warning' : 'error'}>
                            {p.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          {/* Claims History */}
          <Card className="hover:border-border-custom">
            <div className="flex items-center gap-2 pb-3 border-b border-border-custom mb-4">
              <LifeBuoy className="h-5 w-5 text-primary" strokeWidth={2} />
              <h2 className="text-lg font-bold text-text-primary">Linked Claim Requests</h2>
              <span className="ml-auto text-xs bg-slate-100 px-2 py-0.5 rounded font-bold text-text-secondary font-mono">
                {claims.length}
              </span>
            </div>

            {claims.length === 0 ? (
              <div className="text-center py-6 text-sm text-text-secondary">
                No claims filed against this policy yet.
              </div>
            ) : (
              <div className="divide-y divide-border-custom">
                {claims.map((claim) => (
                  <div key={claim.id} className="py-3 flex items-center justify-between">
                    <div>
                      <Link to={`/claims/${claim.id}`} className="font-semibold text-primary hover:underline font-mono">
                        {claim.claimNumber}
                      </Link>
                      <p className="text-xs text-text-secondary mt-1">
                        Amount: ${parseFloat(claim.claimAmount).toLocaleString()} | Reason: {claim.reason}
                      </p>
                    </div>
                    <Badge variant={getClaimStatusVariant(claim.status)}>
                      {claim.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

export default PolicyDetailPage
