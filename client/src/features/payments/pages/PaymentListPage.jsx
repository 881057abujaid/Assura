import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Trash2 } from 'lucide-react'
import { toast } from 'react-hot-toast'

import { storage } from '../../../lib/storage'

import { Button, Card, Alert, Badge, ConfirmModal } from '../../../components/ui'

import { usePayments } from '../hooks/usePayments'
import { ROUTES } from '../../../config/routes'

export function PaymentListPage() {
  const { fetchPayments, deletePaymentRecord, payments, loading, error } = usePayments()
  const navigate = useNavigate()

  const currentUser = storage.getUser()
  const isAgentOrAdmin = currentUser?.role === 'ADMIN' || currentUser?.role === 'AGENT'

  // Confirm Modal state
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchPayments()
  }, [])

  const handleConfirmDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      await deletePaymentRecord(deleteId)
      toast.success('Payment deleted successfully')
      setDeleteId(null)
    } catch {
      // Handled by hook error state
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-text-primary">Premium Payments</h1>
          <p className="text-text-secondary">View collection ledger and payment histories for active policies.</p>
        </div>

        {isAgentOrAdmin && (
          <Button
            onClick={() => navigate(ROUTES.PAYMENT_CREATE)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            Record Payment
          </Button>
        )}
      </div>

      {error && (
        <Alert variant="error">
          {error}
        </Alert>
      )}

      <Card className="p-0 overflow-hidden hover:border-border-custom">
        <div className="overflow-x-auto">
          {payments.length === 0 ? (
            <div className="p-8 text-center text-text-secondary">
              No payments recorded yet.
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-text-secondary border-b border-border-custom">
                  <th className="px-6 py-4">Transaction Date</th>
                  <th className="px-6 py-4">Policy Number</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Method</th>
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4 text-right">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-custom text-text-primary">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      {new Date(p.paymentDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-mono font-semibold text-primary">
                      <Link to={`/policies/${p.policyId}`} className="hover:underline">
                        {p.policy?.policyNumber || 'View Policy'}
                      </Link>
                    </td>
                    <td className="px-6 py-4 font-mono font-medium">
                      ${parseFloat(p.amount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 uppercase text-xs">
                      {p.paymentMethod.replace('_', ' ')}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-text-secondary">
                      {p.transactionId || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Badge variant={p.status === 'PAID' ? 'success' : p.status === 'PENDING' ? 'warning' : 'error'}>
                        {p.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {isAgentOrAdmin && (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setDeleteId(p.id)}
                            className="p-2 text-text-secondary hover:text-error hover:bg-error/5 rounded-lg transition-all"
                            title="Delete Payment"
                          >
                            <Trash2 className="h-4 w-4" strokeWidth={2} />
                          </button>
                        </div>
                      )}
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
        title="Delete Premium Payment"
        message="Are you sure you want to delete this payment record? This action cannot be undone."
        confirmText="Delete Payment"
        variant="danger"
        loading={deleting}
      />
    </div>
  )
}

export default PaymentListPage
