import { useEffect, useState } from 'react'
import { LifeBuoy, Search, Paperclip, X, Upload, FileText, Download, Plus } from 'lucide-react'
import { toast } from 'react-hot-toast'

import { Card, Alert, Spinner, Badge, Button, Input } from '../../../components/ui'
import { useCustomerProfile } from '../hooks/useCustomerProfile'
import { documentService } from '../../documents/services/document.service'
import { claimService } from '../../claims/services/claim.service'

export function CustomerClaimsPage() {
  const { fetchMyProfile, profile, loading, error } = useCustomerProfile()
  const [searchTerm, setSearchTerm] = useState('')

  // File Claim Modal State
  const [showFileClaimModal, setShowFileClaimModal] = useState(false)
  const [selectedPolicyId, setSelectedPolicyId] = useState('')
  const [claimAmount, setClaimAmount] = useState('')
  const [claimReason, setClaimReason] = useState('')
  const [claimDocFile, setClaimDocFile] = useState(null)
  const [filingClaim, setFilingClaim] = useState(false)

  // Document Modal State
  const [selectedClaim, setSelectedClaim] = useState(null)
  const [claimDocs, setClaimDocs] = useState([])
  const [loadingDocs, setLoadingDocs] = useState(false)
  const [uploadFile, setUploadFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchMyProfile()
  }, [])

  const handleOpenDocModal = async (claim) => {
    setSelectedClaim(claim)
    setUploadFile(null)
    setLoadingDocs(true)
    try {
      const res = await documentService.getDocumentsByClaim(claim.id)
      setClaimDocs(res.data || [])
    } catch {
      toast.error('Failed to load documents for this claim.')
    } finally {
      setLoadingDocs(false)
    }
  }

  const handleUploadSubmit = async (e) => {
    e.preventDefault()
    if (!uploadFile) {
      toast.error('Please select a file to upload.')
      return
    }
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('document', uploadFile)
      formData.append('claimId', selectedClaim.id)

      await documentService.uploadDocument(formData)
      toast.success('Document uploaded successfully!')
      setUploadFile(null)

      // Refresh claim docs
      const res = await documentService.getDocumentsByClaim(selectedClaim.id)
      setClaimDocs(res.data || [])
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to upload document.'
      toast.error(msg)
    } finally {
      setUploading(false)
    }
  }

  const policies = profile?.policies || []
  const activePolicies = policies.filter((p) => p.status === 'ACTIVE')

  const handleOpenNewClaimModal = () => {
    setSelectedPolicyId(activePolicies[0]?.id || '')
    setClaimAmount('')
    setClaimReason('')
    setClaimDocFile(null)
    setShowFileClaimModal(true)
  }

  const handleNewClaimSubmit = async (e) => {
    e.preventDefault()
    if (!selectedPolicyId) {
      toast.error('Please select an active policy.')
      return
    }
    if (!claimAmount || parseFloat(claimAmount) <= 0) {
      toast.error('Please enter a valid claim amount.')
      return
    }
    if (!claimReason.trim()) {
      toast.error('Please provide a reason for the claim.')
      return
    }

    setFilingClaim(true)
    try {
      const claimRes = await claimService.createClaim({
        policyId: selectedPolicyId,
        claimAmount: parseFloat(claimAmount),
        reason: claimReason.trim()
      })

      const newClaim = claimRes.data

      if (claimDocFile && newClaim?.id) {
        const formData = new FormData()
        formData.append('document', claimDocFile)
        formData.append('claimId', newClaim.id)
        await documentService.uploadDocument(formData)
      }

      toast.success('Claim submitted successfully with supporting document!')
      setShowFileClaimModal(false)
      setClaimDocFile(null)
      fetchMyProfile()
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to file claim.'
      toast.error(msg)
    } finally {
      setFilingClaim(false)
    }
  }
  // Flatten all claims from all customer policies
  const allClaims = policies.flatMap((p) =>
    (p.claims || []).map((c) => ({
      ...c,
      policyNumber: p.policyNumber,
      policyType: p.policyType?.name || 'N/A',
    }))
  )

  const filteredClaims = allClaims.filter(
    (c) =>
      c.claimNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.policyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.reason.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusVariant = (status) => {
    switch (status) {
      case 'APPROVED': return 'success'
      case 'REJECTED': return 'error'
      case 'PENDING': return 'warning'
      default: return 'warning'
    }
  }

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
      : '—'

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-text-primary">My Claims</h1>
          <p className="text-text-secondary mt-1">
            Track claims filed against your policies and upload supporting proof documents.
          </p>
        </div>
        <Button
          onClick={handleOpenNewClaimModal}
          className="flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          File New Claim
        </Button>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      {/* Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Claims', value: allClaims.length, color: 'text-primary' },
          { label: 'Pending', value: allClaims.filter(c => c.status === 'PENDING').length, color: 'text-warning' },
          { label: 'Approved', value: allClaims.filter(c => c.status === 'APPROVED').length, color: 'text-success' },
        ].map((s) => (
          <Card
            key={s.label}
            className="flex flex-col items-center justify-center py-4 hover:border-border-custom text-center"
          >
            <span className={`text-2xl font-bold ${s.color}`}>{s.value}</span>
            <span className="text-xs text-text-secondary font-semibold uppercase tracking-wider mt-1">{s.label}</span>
          </Card>
        ))}
      </div>

      <Card className="p-0 overflow-hidden hover:border-border-custom">
        {/* Search */}
        <div className="p-4 border-b border-border-custom bg-bg-base flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-3 flex items-center text-text-secondary pointer-events-none">
              <Search className="h-4 w-4" strokeWidth={2} />
            </span>
            <input
              type="text"
              placeholder="Search by claim number, policy or reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border-custom bg-bg-base rounded-xl text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-text-secondary"
            />
          </div>
        </div>

        {/* Claims Table */}
        <div className="overflow-x-auto">
          {filteredClaims.length === 0 ? (
            <div className="p-10 text-center">
              <LifeBuoy className="h-10 w-10 text-text-secondary mx-auto mb-3 opacity-40" />
              <p className="text-text-secondary text-sm">
                {allClaims.length === 0
                  ? 'No claims have been filed yet. Claims are submitted by your assigned agent.'
                  : 'No claims match your search.'}
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-text-secondary border-b border-border-custom">
                  <th className="px-6 py-4">Claim No.</th>
                  <th className="px-6 py-4">Policy No.</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Reason</th>
                  <th className="px-6 py-4">Filed On</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-custom text-text-primary">
                {filteredClaims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-semibold font-mono text-primary text-xs">
                      {claim.claimNumber}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">{claim.policyNumber}</td>
                    <td className="px-6 py-4 text-xs">{claim.policyType}</td>
                    <td className="px-6 py-4 font-mono font-medium">
                      ${parseFloat(claim.claimAmount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 truncate max-w-xs">{claim.reason}</td>
                    <td className="px-6 py-4 text-xs">{formatDate(claim.createdAt)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Badge variant={getStatusVariant(claim.status)}>
                          {claim.status}
                        </Badge>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleOpenDocModal(claim)}
                          className="text-xs py-1 px-2.5 h-auto flex items-center gap-1.5"
                        >
                          <Paperclip className="h-3.5 w-3.5" />
                          Documents
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      {/* Claim Documents Modal */}
      {selectedClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border-custom pb-3">
              <div>
                <h2 className="text-xl font-bold text-text-primary">Claim Documents</h2>
                <p className="text-xs text-text-secondary">Claim #{selectedClaim.claimNumber} • Policy #{selectedClaim.policyNumber}</p>
              </div>
              <button
                onClick={() => setSelectedClaim(null)}
                className="text-text-secondary hover:text-text-primary p-1 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Claim details summary */}
            <div className="bg-slate-50 p-3 rounded-xl border border-border-custom text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-text-secondary">Claim Amount:</span>
                <span className="font-mono font-bold text-primary">${parseFloat(selectedClaim.claimAmount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Reason:</span>
                <span className="font-medium text-text-primary">{selectedClaim.reason}</span>
              </div>
              {selectedClaim.remarks && (
                <div className="flex justify-between pt-1 border-t border-border-custom">
                  <span className="text-text-secondary">Agent Remarks:</span>
                  <span className="font-medium text-text-primary">{selectedClaim.remarks}</span>
                </div>
              )}
            </div>

            {/* Upload Document Section */}
            <form onSubmit={handleUploadSubmit} className="space-y-3 p-3 bg-bg-base border border-border-custom rounded-xl">
              <h3 className="text-sm font-semibold text-text-primary flex items-center gap-1.5">
                <Upload className="h-4 w-4 text-primary" />
                Upload Supporting File (PDF, JPG, PNG)
              </h3>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setUploadFile(e.target.files[0] || null)}
                className="w-full text-xs text-text-secondary border border-border-custom rounded-lg p-2 bg-slate-50 cursor-pointer"
                required
              />
              <div className="flex justify-end">
                <Button type="submit" size="sm" loading={uploading} disabled={!uploadFile}>
                  Upload File
                </Button>
              </div>
            </form>

            {/* Existing Documents List */}
            <div>
              <h3 className="text-sm font-bold text-text-primary mb-2">Attached Documents ({claimDocs.length})</h3>
              {loadingDocs ? (
                <div className="flex justify-center py-4">
                  <Spinner />
                </div>
              ) : claimDocs.length === 0 ? (
                <p className="text-xs text-text-secondary italic text-center py-4 bg-slate-50 rounded-xl">
                  No proof documents attached yet.
                </p>
              ) : (
                <div className="space-y-2">
                  {claimDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 border border-border-custom rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="h-4 w-4 text-primary shrink-0" />
                        <span className="font-semibold text-text-primary truncate">{doc.fileName}</span>
                      </div>
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:underline font-semibold shrink-0"
                      >
                        <Download className="h-3.5 w-3.5" /> View / Download
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-border-custom">
              <Button variant="secondary" onClick={() => setSelectedClaim(null)}>
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}
      {/* File New Claim Modal */}
      {showFileClaimModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md space-y-4">
            <div className="flex items-center justify-between border-b border-border-custom pb-3">
              <h2 className="text-xl font-bold text-text-primary">File a New Claim</h2>
              <button
                onClick={() => setShowFileClaimModal(false)}
                className="text-text-secondary hover:text-text-primary p-1 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {activePolicies.length === 0 ? (
              <div className="space-y-4">
                <Alert variant="warning">
                  You currently have no <strong>ACTIVE</strong> insurance policies. Claims can only be submitted against active policies. Please complete your premium payment first.
                </Alert>
                <div className="flex justify-end">
                  <Button variant="secondary" onClick={() => setShowFileClaimModal(false)}>
                    Close
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleNewClaimSubmit} className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-text-primary">Select Active Policy</label>
                  <select
                    value={selectedPolicyId}
                    onChange={(e) => setSelectedPolicyId(e.target.value)}
                    className="w-full border border-border-custom bg-bg-base rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    required
                  >
                    {activePolicies.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.policyNumber} — {p.policyType?.name || 'Policy'} (Max ${parseFloat(p.coverageAmount).toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  type="number"
                  step="0.01"
                  label="Claim Amount ($)"
                  placeholder="e.g. 500.00"
                  value={claimAmount}
                  onChange={(e) => setClaimAmount(e.target.value)}
                  required
                />

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-text-primary">Reason for Claim</label>
                  <textarea
                    placeholder="Describe the incident, damage, or medical reason..."
                    value={claimReason}
                    onChange={(e) => setClaimReason(e.target.value)}
                    rows={3}
                    className="w-full border border-border-custom bg-bg-base rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-text-primary">Supporting Document (Optional)</label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setClaimDocFile(e.target.files[0] || null)}
                    className="w-full text-xs text-text-secondary border border-border-custom rounded-xl p-2 bg-slate-50 cursor-pointer"
                  />
                  <p className="text-[11px] text-text-secondary">Upload receipts, bills, or medical reports (PDF, JPG, PNG)</p>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-border-custom">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowFileClaimModal(false)}
                    disabled={filingClaim}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" loading={filingClaim}>
                    Submit Claim
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </div>
      )}
    </div>
  )
}

export default CustomerClaimsPage
