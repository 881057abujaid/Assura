import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { FolderOpen, Upload, Trash2 } from 'lucide-react'

import { storage } from '../../../lib/storage'

import { Card, Alert, Spinner, Button, ConfirmModal } from '../../../components/ui'

import { useDocuments } from '../hooks/useDocuments'
import { useCustomers } from '../../customers/hooks/useCustomers'
import { documentService } from '../services/document.service'

export function DocumentListPage() {
  const { fetchCustomerDocuments, deleteDocumentRecord, documents, loading, error } = useDocuments()
  const { fetchCustomers, customers } = useCustomers()
  const [selectedCustomerId, setSelectedCustomerId] = useState('')
  const [uploading, setUploading] = useState(false)

  const currentUser = storage.getUser()
  const isAgentOrAdmin = currentUser?.role === 'ADMIN' || currentUser?.role === 'AGENT'
  const isAdmin = currentUser?.role === 'ADMIN'

  // Confirm Modal State
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchCustomers()
  }, [])

  useEffect(() => {
    if (selectedCustomerId) {
      fetchCustomerDocuments(selectedCustomerId)
    }
  }, [selectedCustomerId])

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!selectedCustomerId) {
      toast.error('Please select a customer first')
      return
    }

    const formData = new FormData()
    formData.append('document', file)
    formData.append('customerId', selectedCustomerId)

    setUploading(true)
    try {
      await documentService.uploadDocument(formData)
      toast.success('Document uploaded successfully!')
      fetchCustomerDocuments(selectedCustomerId)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload document')
    } finally {
      setUploading(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      await deleteDocumentRecord(deleteId)
      toast.success('Document deleted successfully')
      setDeleteId(null)
    } catch {
      // Handled by hook error state
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-text-primary">Documents Repository</h1>
        <p className="text-text-secondary">Access and organize policy agreements, claim files, and customer IDs.</p>
      </div>

      {error && (
        <Alert variant="error">
          {error}
        </Alert>
      )}

      <Card className="hover:border-border-custom space-y-6">
        {/* Selection Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end pb-4 border-b border-border-custom">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-text-primary">Select Customer Profile</label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full border border-border-custom bg-bg-base rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            >
              <option value="">Select a Customer...</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.fullName} ({c.phone})
                </option>
              ))}
            </select>
          </div>

          {selectedCustomerId && isAgentOrAdmin && (
            <div className="flex items-center gap-3">
              <label className="relative cursor-pointer w-full">
                <span className="flex items-center justify-center gap-2 px-4 py-2 border border-dashed border-primary bg-primary/5 hover:bg-primary/10 text-primary text-sm font-semibold rounded-xl transition-all shadow-sm">
                  <Upload className="h-4 w-4" />
                  {uploading ? 'Uploading Attachment...' : 'Upload Document'}
                </span>
                <input
                  type="file"
                  className="sr-only"
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
              </label>
            </div>
          )}
        </div>

        {/* Selected Customer Documents Grid */}
        {!selectedCustomerId ? (
          <div className="text-center py-12 text-text-secondary text-sm">
            Select a customer profile from the dropdown list to view their attached documents.
          </div>
        ) : loading && documents.length === 0 ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-12 text-text-secondary text-sm">
            No documents uploaded for this customer record.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex flex-col justify-between p-4 border border-border-custom rounded-2xl bg-bg-base hover:border-primary/30 transition-all duration-150"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                    <FolderOpen className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-text-primary truncate" title={doc.fileName}>
                      {doc.fileName}
                    </p>
                    <p className="text-xs text-text-secondary font-mono mt-0.5 uppercase">
                      {(doc.mimeType || '').split('/')[1] || 'File'} | {(doc.fileSize / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border-custom flex items-center justify-between">
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    View File
                  </a>

                  {isAdmin && (
                    <button
                      onClick={() => setDeleteId(doc.id)}
                      className="p-1.5 text-text-secondary hover:text-error hover:bg-error/5 rounded-lg transition-all"
                      title="Delete Document"
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={2} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <ConfirmModal
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Document"
        message="Are you sure you want to permanently delete this document file? This action cannot be undone."
        confirmText="Delete Document"
        variant="danger"
        loading={deleting}
      />
    </div>
  )
}

export default DocumentListPage
