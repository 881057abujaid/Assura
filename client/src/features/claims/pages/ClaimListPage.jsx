import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Search, Plus, Eye, Trash2, Edit2 } from 'lucide-react'

import { storage } from '../../../lib/storage'

import { Button, Card, Alert, Badge, ConfirmModal } from '../../../components/ui'

import { useClaims } from '../hooks/useClaims'
import { ROUTES } from '../../../config/routes'

export function ClaimListPage() {
  const { fetchClaims, deleteClaimRecord, claims, loading, error } = useClaims()
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  const currentUser = storage.getUser()
  const isAgentOrAdmin = currentUser?.role === 'ADMIN' || currentUser?.role === 'AGENT'
  const isAdmin = currentUser?.role === 'ADMIN'

  // Confirm Modal state
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchClaims()
  }, [])

  const handleConfirmDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      await deleteClaimRecord(deleteId)
      toast.success('Claim deleted successfully')
      setDeleteId(null)
    } catch {
      // Handled by hook error state
    } finally {
      setDeleting(false)
    }
  }

  // Filter claims by claim number
  const filteredClaims = claims.filter((c) =>
    c.claimNumber.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusVariant = (status) => {
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-text-primary">Claims</h1>
          <p className="text-text-secondary">View and resolve insurance claim payout requests.</p>
        </div>

        {isAgentOrAdmin && (
          <Button
            onClick={() => navigate(ROUTES.CLAIM_CREATE)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            File Claim
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
              placeholder="Search by claim number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border-custom bg-bg-base rounded-xl text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-text-secondary"
            />
          </div>
        </div>

        {/* Desktop claims table */}
        <div className="overflow-x-auto">
          {filteredClaims.length === 0 ? (
            <div className="p-8 text-center text-text-secondary">
              No claims found.
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-text-secondary border-b border-border-custom">
                  <th className="px-6 py-4">Claim Number</th>
                  <th className="px-6 py-4">Policy Number</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Reason</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-custom text-text-primary">
                {filteredClaims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-semibold font-mono text-primary">
                      {claim.claimNumber}
                    </td>
                    <td className="px-6 py-4 font-mono">
                      {claim.policy?.policyNumber || 'N/A'}
                    </td>
                    <td className="px-6 py-4 font-mono font-medium">
                      ${parseFloat(claim.claimAmount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 truncate max-w-xs">
                      {claim.reason}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={getStatusVariant(claim.status)}>
                        {claim.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {claim.status === 'PENDING' && isAgentOrAdmin && (
                          <Link
                            to={`/claims/${claim.id}/edit`}
                            className="p-2 text-text-secondary hover:text-primary hover:bg-slate-100 rounded-lg transition-all"
                            title="Edit Claim"
                          >
                            <Edit2 className="h-4 w-4" strokeWidth={2} />
                          </Link>
                        )}
                        <Link
                          to={`/claims/${claim.id}`}
                          className="p-2 text-text-secondary hover:text-primary hover:bg-slate-100 rounded-lg transition-all"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" strokeWidth={2} />
                        </Link>

                        {isAdmin && (
                          <button
                            onClick={() => setDeleteId(claim.id)}
                            className="p-2 text-text-secondary hover:text-error hover:bg-error/5 rounded-lg transition-all"
                            title="Delete Claim"
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
        title="Delete Claim Request"
        message="Are you sure you want to delete this pending claim request? This action cannot be undone."
        confirmText="Delete Claim"
        variant="danger"
        loading={deleting}
      />
    </div>
  )
}

export default ClaimListPage
