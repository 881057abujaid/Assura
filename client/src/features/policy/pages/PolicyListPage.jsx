import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Search, Plus, Eye, Edit2, Trash2, Check, X } from 'lucide-react'

import { storage } from '../../../lib/storage'

import { Button, Card, Alert, Badge, ConfirmModal } from '../../../components/ui'

import { usePolicies } from '../hooks/usePolicies'
import { ROUTES } from '../../../config/routes'

export function PolicyListPage() {
  const { fetchPolicies, deletePolicyRecord, updatePolicyRecord, policies, loading, error } = usePolicies()
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  const currentUser = storage.getUser()
  const isAgentOrAdmin = currentUser?.role === 'ADMIN' || currentUser?.role === 'AGENT'
  const isAdmin = currentUser?.role === 'ADMIN'

  // Confirm Modal state
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchPolicies()
  }, [])

  const handleConfirmDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      await deletePolicyRecord(deleteId)
      toast.success('Policy deleted successfully')
      setDeleteId(null)
    } catch {
      // Handled by hook error state
    } finally {
      setDeleting(false)
    }
  }

  const handleApprove = async (id) => {
    try {
      await updatePolicyRecord(id, { status: 'APPROVED' })
      toast.success('Policy application approved! Status updated to APPROVED.')
    } catch {
      toast.error('Failed to approve policy application.')
    }
  }

  const handleReject = async (id) => {
    try {
      await updatePolicyRecord(id, { status: 'CANCELLED' })
      toast.success('Policy application rejected.')
    } catch {
      toast.error('Failed to reject policy application.')
    }
  }

  // Filter policies by policy number
  const filteredPolicies = policies.filter((p) =>
    p.policyNumber.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusVariant = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'success'
      case 'APPROVED':
        return 'info'
      case 'EXPIRED':
        return 'error'
      case 'CANCELLED':
        return 'error'
      default:
        return 'warning'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-text-primary">Policies</h1>
          <p className="text-text-secondary">View and manage customer insurance policy agreements.</p>
        </div>

        {isAgentOrAdmin && (
          <Button
            onClick={() => navigate(ROUTES.POLICY_CREATE)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            Create Policy
          </Button>
        )}
      </div>

      {error && (
        <Alert variant="error">
          {error}
        </Alert>
      )}

      <Card className="p-0 overflow-hidden hover:border-border-custom">
        {/* Search header bar */}
        <div className="p-4 border-b border-border-custom bg-bg-base flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-3 flex items-center text-text-secondary pointer-events-none">
              <Search className="h-4 w-4" strokeWidth={2} />
            </span>
            <input
              type="text"
              placeholder="Search by policy number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border-custom bg-bg-base rounded-xl text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-text-secondary"
            />
          </div>
        </div>

        {/* Desktop policies table */}
        <div className="overflow-x-auto">
          {filteredPolicies.length === 0 ? (
            <div className="p-8 text-center text-text-secondary">
              No policies found.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-text-secondary border-b border-border-custom">
                  <th className="px-6 py-4">Policy Number</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Premium</th>
                  <th className="px-6 py-4">Coverage</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-custom text-sm text-text-primary">
                {filteredPolicies.map((policy) => (
                  <tr key={policy.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-semibold font-mono text-primary">
                      {policy.policyNumber}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {policy.customer?.fullName || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      {policy.policyType?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 font-mono font-medium">
                      ${parseFloat(policy.premiumAmount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-mono font-medium">
                      ${parseFloat(policy.coverageAmount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={getStatusVariant(policy.status)}>
                        {policy.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/policies/${policy.id}`}
                          className="p-2 text-text-secondary hover:text-primary hover:bg-slate-100 rounded-lg transition-all"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" strokeWidth={2} />
                        </Link>

                        {isAgentOrAdmin && policy.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleApprove(policy.id)}
                              className="p-2 text-success hover:bg-success/10 rounded-lg transition-all"
                              title="Approve Policy Application"
                            >
                              <Check className="h-4 w-4" strokeWidth={2} />
                            </button>
                            <button
                              onClick={() => handleReject(policy.id)}
                              className="p-2 text-error hover:bg-error/10 rounded-lg transition-all"
                              title="Reject Policy Application"
                            >
                              <X className="h-4 w-4" strokeWidth={2} />
                            </button>
                          </>
                        )}

                        {isAgentOrAdmin && (
                          <Link
                            to={`/policies/${policy.id}/edit`}
                            className="p-2 text-text-secondary hover:text-secondary hover:bg-slate-100 rounded-lg transition-all"
                            title="Edit Policy"
                          >
                            <Edit2 className="h-4 w-4" strokeWidth={2} />
                          </Link>
                        )}

                        {isAdmin && (
                          <button
                            onClick={() => setDeleteId(policy.id)}
                            className="p-2 text-text-secondary hover:text-error hover:bg-error/5 rounded-lg transition-all"
                            title="Delete Policy"
                          >
                            <Trash2 className="h-4 w-4" strokeWidth={2} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      <ConfirmModal
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Insurance Policy"
        message="Are you sure you want to delete this policy record? Associated payments and records may be impacted."
        confirmText="Delete Policy"
        variant="danger"
        loading={deleting}
      />
    </div>
  )
}

export default PolicyListPage
