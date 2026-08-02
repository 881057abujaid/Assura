import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Plus, Pencil, Trash2 } from 'lucide-react'

import { useAuth } from '../../../context/AuthContext'
import { Button, Card, Alert, ConfirmModal } from '../../../components/ui'

import { usePolicyTypes } from '../hooks/usePolicyTypes'
import { ROUTES } from '../../../config/routes'

export function PolicyTypeListPage() {
  const { fetchPolicyTypes, deletePolicyTypeRecord, policyTypes, loading, error } = usePolicyTypes()
  const navigate = useNavigate()

  const { user: currentUser } = useAuth()
  const isAdmin = currentUser?.role === 'ADMIN'

  // Confirm Modal state
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchPolicyTypes()
  }, [])

  const handleConfirmDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      await deletePolicyTypeRecord(deleteId)
      toast.success('Policy type deleted successfully')
      setDeleteId(null)
    } catch {
      // Handled by hook error state
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-text-primary">Policy Types</h1>
          <p className="text-text-secondary">Manage types of insurance products offered (e.g. Life, Health, Motor).</p>
        </div>

        {isAdmin && (
          <Button
            onClick={() => navigate(ROUTES.POLICY_TYPE_CREATE)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            Add Type
          </Button>
        )}
      </div>

      {error && (
        <Alert variant="error">
          {error}
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {policyTypes.length === 0 ? (
          <div className="md:col-span-2 lg:col-span-3 text-center py-12 text-text-secondary">
            No policy types created yet.
          </div>
        ) : (
          policyTypes.map((type) => (
            <Card key={type.id} className="hover:border-border-custom flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-bold text-text-primary mb-2">{type.name}</h2>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {type.description || 'No description provided.'}
                </p>
              </div>

              {isAdmin && (
                <div className="mt-6 pt-4 border-t border-border-custom flex justify-end gap-1">
                  <button
                    onClick={() =>
                      navigate(ROUTES.POLICY_TYPE_EDIT.replace(':policyTypeId', type.id))
                    }
                    className="p-2 text-text-secondary hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                    title="Edit Policy Type"
                  >
                    <Pencil className="h-4 w-4" strokeWidth={2} />
                  </button>
                  <button
                    onClick={() => setDeleteId(type.id)}
                    className="p-2 text-text-secondary hover:text-error hover:bg-error/5 rounded-lg transition-all"
                    title="Delete Policy Type"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={2} />
                  </button>
                </div>
              )}
            </Card>
          ))
        )}
      </div>

      <ConfirmModal
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Policy Type"
        message="Are you sure you want to delete this policy type? All associated configuration for this insurance product will be removed."
        confirmText="Delete Type"
        variant="danger"
        loading={deleting}
      />
    </div>
  )
}

export default PolicyTypeListPage
