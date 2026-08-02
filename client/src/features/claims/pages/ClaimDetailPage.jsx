import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-hot-toast'
import { LifeBuoy, FolderOpen, ArrowLeft, CheckCircle, XCircle } from 'lucide-react'

import { storage } from '../../../lib/storage'

import { Card, Alert, Spinner, Button, Badge, Input } from '../../../components/ui'

import { useClaimDetail } from '../hooks/useClaimDetail'
import { useReviewClaim } from '../hooks/useReviewClaim'
import { reviewClaimSchema } from '../validations/claim.validation'
import { documentService } from '../../documents/services/document.service'

export function ClaimDetailPage() {
  const { claimId } = useParams()
  const { fetchClaimDetail, claim, documents, loading, error } = useClaimDetail()
  const { submitClaimReview, loading: reviewLoading, error: reviewError } = useReviewClaim()
  const [uploading, setUploading] = useState(false)

  const currentUser = storage.getUser()
  const isAgentOrAdmin = currentUser?.role === 'ADMIN' || currentUser?.role === 'AGENT'

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(reviewClaimSchema),
    defaultValues: {
      status: 'APPROVED',
      remarks: ''
    }
  })

  useEffect(() => {
    fetchClaimDetail(claimId)
  }, [claimId])

  const onReviewSubmit = async (data) => {
    try {
      await submitClaimReview(claimId, data)
      toast.success('Claim review completed successfully')
      fetchClaimDetail(claimId)
    } catch {
      // Handled by hook error state
    }
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('document', file)
    formData.append('claimId', claimId)

    setUploading(true)
    try {
      await documentService.uploadDocument(formData)
      toast.success('Document uploaded successfully!')
      fetchClaimDetail(claimId)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload document')
    } finally {
      setUploading(false)
    }
  }

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

  if (loading && !claim) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Link to="/claims" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Claims
        </Link>
        <Alert variant="error">{error}</Alert>
      </div>
    )
  }

  if (!claim) return null

  return (
    <div className="space-y-6">
      {/* Header Breadcrumbs */}
      <div>
        <Link to="/claims" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to Claims
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold text-text-primary font-mono">{claim.claimNumber}</h1>
          <p className="text-text-secondary">Claim request assessment and attached supporting document checks.</p>
        </div>
      </div>

      {reviewError && (
        <Alert variant="error">{reviewError}</Alert>
      )}

      {/* Grid panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side: Detail metadata */}
        <div className="md:col-span-1 space-y-6">
          <Card className="hover:border-border-custom space-y-4">
            <div className="flex items-center justify-between border-b border-border-custom pb-3">
              <h2 className="text-lg font-bold text-text-primary">Claim Details</h2>
              <Badge variant={getStatusVariant(claim.status)}>
                {claim.status}
              </Badge>
            </div>

            <div className="space-y-3 text-sm text-text-primary">
              <div>
                <span className="text-xs text-text-secondary uppercase block font-semibold">Policy Target</span>
                <Link to={`/policies/${claim.policyId}`} className="text-primary hover:underline font-mono font-semibold">
                  {claim.policy?.policyNumber || 'View Policy'}
                </Link>
              </div>
              <div>
                <span className="text-xs text-text-secondary uppercase block font-semibold">Requested Payout</span>
                <span className="font-mono font-semibold text-lg text-primary">
                  ${parseFloat(claim.claimAmount).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-xs text-text-secondary uppercase block font-semibold">Filing Date</span>
                <span>{new Date(claim.createdAt).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-xs text-text-secondary uppercase block font-semibold">Reason Description</span>
                <p className="text-text-secondary mt-1 leading-relaxed">{claim.reason}</p>
              </div>
              {claim.remarks && (
                <div>
                  <span className="text-xs text-text-secondary uppercase block font-semibold">Review remarks</span>
                  <p className="text-text-secondary mt-1 italic">{claim.remarks}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Optional Review Box */}
          {claim.status === 'PENDING' && isAgentOrAdmin && (
            <Card className="hover:border-border-custom border-primary/20 bg-primary/5">
              <h2 className="text-lg font-bold text-text-primary mb-3">Review Action</h2>

              <form onSubmit={handleSubmit(onReviewSubmit)} className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-text-primary">Outcome Decision</label>
                  <select
                    {...register('status')}
                    disabled={reviewLoading}
                    className="w-full border border-border-custom bg-bg-base rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  >
                    <option value="APPROVED">Approve Claim</option>
                    <option value="REJECTED">Reject Claim</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-text-primary">
                    Outcome Remarks {watch('status') === 'REJECTED' && <span className="text-error">*</span>}
                  </label>
                  <textarea
                    placeholder="Enter review remarks. Required if rejecting..."
                    {...register('remarks')}
                    disabled={reviewLoading}
                    rows={3}
                    className="w-full border border-border-custom bg-bg-base rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                  {errors.remarks && (
                    <span className="text-xs text-error font-medium">{errors.remarks.message}</span>
                  )}
                </div>

                <Button type="submit" loading={reviewLoading} className="w-full">
                  Submit Assessment
                </Button>
              </form>
            </Card>
          )}
        </div>

        {/* Right Side: Linked attachments */}
        <div className="md:col-span-2 space-y-6">
          <Card className="hover:border-border-custom">
            <div className="flex items-center gap-2 pb-3 border-b border-border-custom mb-4">
              <FolderOpen className="h-5 w-5 text-primary" strokeWidth={2} />
              <h2 className="text-lg font-bold text-text-primary">Claim Case Files</h2>
              <span className="ml-auto text-xs bg-slate-100 px-2 py-0.5 rounded font-bold text-text-secondary font-mono">
                {documents.length}
              </span>
            </div>

            <div className="space-y-4">
              {isAgentOrAdmin && (
                <div className="flex items-center gap-3 bg-surface p-4 rounded-xl border border-dashed border-border-custom justify-between">
                  <span className="text-sm text-text-secondary">Attach supporting case file (PDF, PNG, JPG)</span>
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
                  No supporting files uploaded for this claim.
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

export default ClaimDetailPage
