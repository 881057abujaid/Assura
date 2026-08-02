import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Search, Plus, Eye, Edit2, Trash2 } from 'lucide-react'

import { useAuth } from '../../../context/AuthContext'

import { Button, Input, Card, Alert, ConfirmModal } from '../../../components/ui'

import { useCustomers } from '../hooks/useCustomers'
import { ROUTES } from '../../../config/routes'

export function CustomerListPage() {
  const { fetchCustomers, deleteCustomerRecord, customers, loading, error } = useCustomers()
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()
  
  const { user: currentUser } = useAuth()
  const isAgentOrAdmin = currentUser?.role === 'ADMIN' || currentUser?.role === 'AGENT'
  const isAdmin = currentUser?.role === 'ADMIN'

  // Confirm Modal state
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchCustomers()
  }, [])

  const handleConfirmDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      await deleteCustomerRecord(deleteId)
      toast.success('Customer deleted successfully')
      setDeleteId(null)
    } catch {
      // Handled by hook error state
    } finally {
      setDeleting(false)
    }
  }

  // Filter customers by name or phone
  const filteredCustomers = customers.filter(
    (c) =>
      c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.phone && c.phone.includes(searchTerm))
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-text-primary">Customers</h1>
          <p className="text-text-secondary">View and manage customer profiles registered under Assura.</p>
        </div>
        
        {isAgentOrAdmin && (
          <Button
            onClick={() => navigate(ROUTES.CUSTOMER_CREATE)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            Add Customer
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
              placeholder="Search by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border-custom bg-bg-base rounded-xl text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-text-secondary"
            />
          </div>
        </div>

        {/* Desktop customers table */}
        <div className="overflow-x-auto">
          {filteredCustomers.length === 0 ? (
            <div className="p-8 text-center text-text-secondary">
              No customers found.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-text-secondary border-b border-border-custom">
                  <th className="px-6 py-4">Full Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">City / State</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-custom text-sm text-text-primary">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-semibold">
                      <div className="flex items-center gap-2">
                        <span>{customer.fullName}</span>
                        {!customer.profileCompleted && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                            Incomplete
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text-secondary font-mono">
                      {customer.user?.email || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-text-secondary">
                      {customer.phone || <span className="italic text-text-secondary/50">None</span>}
                    </td>
                    <td className="px-6 py-4 text-text-secondary">
                      {customer.city && customer.state ? `${customer.city}, ${customer.state}` : <span className="italic text-text-secondary/50">N/A</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/customers/${customer.id}`}
                          className="p-2 text-text-secondary hover:text-primary hover:bg-slate-100 rounded-lg transition-all"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" strokeWidth={2} />
                        </Link>
                        
                        {isAgentOrAdmin && (
                          <Link
                            to={`/customers/${customer.id}/edit`}
                            className="p-2 text-text-secondary hover:text-secondary hover:bg-slate-100 rounded-lg transition-all"
                            title="Edit Profile"
                          >
                            <Edit2 className="h-4 w-4" strokeWidth={2} />
                          </Link>
                        )}

                        {isAdmin && (
                          <button
                            onClick={() => setDeleteId(customer.id)}
                            className="p-2 text-text-secondary hover:text-error hover:bg-error/5 rounded-lg transition-all"
                            title="Delete Profile"
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
        title="Delete Customer Profile"
        message="Are you sure you want to delete this customer record? Customers with active policies or files cannot be deleted."
        confirmText="Delete Customer"
        variant="danger"
        loading={deleting}
      />
    </div>
  )
}

export default CustomerListPage
