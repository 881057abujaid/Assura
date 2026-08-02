import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { FileText, LifeBuoy, FolderOpen, ArrowLeft, Plus } from 'lucide-react'

import { useAuth } from '../../../context/AuthContext'

import { Card, Alert, Spinner, Button, Badge } from '../../../components/ui'

import { useCustomerDetail } from '../hooks/useCustomerDetail'
import { documentService } from '../../documents/services/document.service'

export function CustomerDetailPage() {
  const { customerId } = useParams()
  const { fetchCustomerDetail, customer, policies, documents, loading, error } = useCustomerDetail()
  const [uploading, setUploading] = useState(false)
  
  const { user: currentUser } = useAuth()
  const isAgentOrAdmin = currentUser?.role === 'ADMIN' || currentUser?.role === 'AGENT'

  useEffect(() => {
    fetchCustomerDetail(customerId)
  }, [customerId])

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('document', file)
    formData.append('customerId', customerId)

    setUploading(true)
    try {
      await documentService.uploadDocument(formData)
      toast.success('Document uploaded successfully!')
      fetchCustomerDetail(customerId)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload document')
    } finally {
      setUploading(false)
    }
  }

  if (loading && !customer) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Link to="/customers" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Customers
        </Link>
        <Alert variant="error">{error}</Alert>
      </div>
    )
  }

  if (!customer) return null

  return (
    <div className="space-y-6">
      {/* Header breadcrumbs */}
      <div>
        <Link to="/customers" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to Customers
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-text-primary">{customer.fullName}</h1>
            <p className="text-text-secondary">Customer Profile Dashboard</p>
          </div>
          {isAgentOrAdmin && (
            <Link to={`/policies/new?customerId=${customer.id}`}>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Assign Policy
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Grid of detail metadata */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left pane: Profile stats card */}
        <Card className="hover:border-border-custom md:col-span-1 space-y-6">
          <div className="text-center pb-4 border-b border-border-custom">
            <div className="h-20 w-20 bg-primary/10 text-primary font-bold text-3xl flex items-center justify-center rounded-2xl mx-auto mb-3">
              {customer.fullName.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-lg font-bold text-text-primary">{customer.fullName}</h2>
            <p className="text-sm text-text-secondary font-mono">
              {customer.phone || <span className="italic text-text-secondary/50">No Phone</span>}
            </p>
          </div>

          <div className="space-y-3 text-sm text-text-primary">
            <div>
              <span className="text-xs text-text-secondary uppercase block font-semibold">Gender</span>
              <span className="capitalize">
                {customer.gender ? customer.gender.toLowerCase() : <span className="italic text-text-secondary/50">Not Provided</span>}
              </span>
            </div>
            <div>
              <span className="text-xs text-text-secondary uppercase block font-semibold">Date of Birth</span>
              <span>
                {customer.dob ? new Date(customer.dob).toLocaleDateString() : <span className="italic text-text-secondary/50">Not Provided</span>}
              </span>
            </div>
            <div>
              <span className="text-xs text-text-secondary uppercase block font-semibold">Street Address</span>
              <span>
                {customer.address || <span className="italic text-text-secondary/50">Not Provided</span>}
              </span>
            </div>
            <div>
              <span className="text-xs text-text-secondary uppercase block font-semibold">City / State</span>
              <span>
                {customer.city && customer.state ? `${customer.city}, ${customer.state}` : <span className="italic text-text-secondary/50">Not Provided</span>}
              </span>
            </div>
            <div>
              <span className="text-xs text-text-secondary uppercase block font-semibold">Country / Postal Code</span>
              <span>
                {customer.country && customer.postalCode ? `${customer.country} - ${customer.postalCode}` : <span className="italic text-text-secondary/50">Not Provided</span>}
              </span>
            </div>
          </div>
        </Card>

        {/* Right pane: Policies and Documents */}
        <div className="md:col-span-2 space-y-6">
          {/* Linked Policies */}
          <Card className="hover:border-border-custom">
            <div className="flex items-center gap-2 pb-3 border-b border-border-custom mb-4">
              <FileText className="h-5 w-5 text-primary" strokeWidth={2} />
              <h2 className="text-lg font-bold text-text-primary">Assigned Policies</h2>
              <span className="ml-auto text-xs bg-slate-100 px-2 py-0.5 rounded font-bold text-text-secondary">
                {policies.length}
              </span>
            </div>

            {policies.length === 0 ? (
              <div className="text-center py-6 text-sm text-text-secondary">
                No active policies assigned to this customer.
              </div>
            ) : (
              <div className="divide-y divide-border-custom">
                {policies.map((policy) => (
                  <div key={policy.id} className="py-3 flex items-center justify-between">
                    <div>
                      <Link to={`/policies/${policy.id}`} className="font-semibold text-primary hover:underline">
                        {policy.policyNumber}
                      </Link>
                      <p className="text-xs text-text-secondary mt-1">
                        Coverage: ${parseFloat(policy.coverageAmount).toLocaleString()} | Premium: ${parseFloat(policy.premiumAmount).toLocaleString()}
                      </p>
                    </div>
                    <Badge variant={policy.status === 'ACTIVE' ? 'success' : 'error'}>
                      {policy.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Linked Documents & Uploader */}
          <Card className="hover:border-border-custom">
            <div className="flex items-center gap-2 pb-3 border-b border-border-custom mb-4">
              <FolderOpen className="h-5 w-5 text-primary" strokeWidth={2} />
              <h2 className="text-lg font-bold text-text-primary">Documents Attachment</h2>
              <span className="ml-auto text-xs bg-slate-100 px-2 py-0.5 rounded font-bold text-text-secondary">
                {documents.length}
              </span>
            </div>

            <div className="space-y-4">
              {isAgentOrAdmin && (
                <div className="flex items-center gap-3 bg-surface p-4 rounded-xl border border-dashed border-border-custom justify-between">
                  <span className="text-sm text-text-secondary">Upload a new document (PDF, PNG, JPG)</span>
                  <label className="relative cursor-pointer">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-base border border-border-custom text-xs font-semibold text-text-primary hover:bg-slate-50 transition-colors shadow-sm">
                      {uploading ? 'Uploading...' : 'Choose File'}
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

              {documents.length === 0 ? (
                <div className="text-center py-6 text-sm text-text-secondary">
                  No documents uploaded for this customer.
                </div>
              ) : (
                <div className="divide-y divide-border-custom">
                  {documents.map((doc) => (
                    <div key={doc.id} className="py-3 flex items-center justify-between text-sm">
                      <div className="truncate pr-4">
                        <p className="font-semibold text-text-primary truncate">{doc.fileName}</p>
                        <p className="text-xs text-text-secondary font-mono mt-0.5 capitalize">
                          {(doc.mimeType || '').split('/')[1] || 'Unknown'} | {(doc.fileSize / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold text-primary hover:underline"
                      >
                        Download
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default CustomerDetailPage
