import { useEffect, useState } from 'react'
import { ArrowRight, FileText, Search, Plus, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'

import { Card, Alert, Spinner, Badge, Button, Input } from '../../../components/ui'
import { useCustomerProfile } from '../../customers/hooks/useCustomerProfile'
import { policyService } from '../../policy/services/policy.service'
import { paymentService } from '../../payments/services/payment.service'
import { claimService } from '../../claims/services/claim.service'
import { documentService } from '../../documents/services/document.service'

export function CustomerPoliciesPage() {
  const { fetchMyProfile, profile, loading, error } = useCustomerProfile()
  const [searchTerm, setSearchTerm] = useState('')

  // Apply Policy Modal State
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [policyTypes, setPolicyTypes] = useState([])
  const [applying, setApplying] = useState(false)
  const [applyForm, setApplyForm] = useState({
    policyTypeId: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    description: ''
  })

  useEffect(() => {
    fetchMyProfile()
  }, [])

  const handleOpenApplyModal = async () => {
    try {
      const res = await policyService.getPolicyTypes()
      setPolicyTypes(res.data || [])
      setShowApplyModal(true)
    } catch {
      toast.error('Failed to load available policy types.')
    }
  }

  const handleApplySubmit = async (e) => {
    e.preventDefault()
    if (!applyForm.policyTypeId) {
      toast.error('Please select a policy type.')
      return
    }
    setApplying(true)
    try {
      await policyService.applyPolicy(applyForm)
      toast.success('Policy application submitted successfully! Pending agent review.')
      setShowApplyModal(false)
      fetchMyProfile()
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit policy application.'
      toast.error(msg)
    } finally {
      setApplying(false)
    }
  }

  // Pay Premium Modal State
  const [payModalPolicy, setPayModalPolicy] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('UPI')
  const [paying, setPaying] = useState(false)

  const handleOpenPayModal = (policy) => {
    setPayModalPolicy(policy)
    setPaymentMethod('UPI')
  }

  const handlePaySubmit = async (e) => {
    e.preventDefault()
    if (!payModalPolicy) return
    setPaying(true)
    try {
      await paymentService.customerPay({
        policyId: payModalPolicy.id,
        paymentMethod
      })
      toast.success('Payment completed successfully! Policy is now ACTIVE.')
      setPayModalPolicy(null)
      fetchMyProfile()
    } catch (err) {
      const msg = err.response?.data?.message || 'Payment failed.'
      toast.error(msg)
    } finally {
      setPaying(false)
    }
  }

  // File Claim Modal State
  const [claimModalPolicy, setClaimModalPolicy] = useState(null)
  const [claimAmount, setClaimAmount] = useState('')
  const [claimReason, setClaimReason] = useState('')
  const [claimDocFile, setClaimDocFile] = useState(null)
  const [filingClaim, setFilingClaim] = useState(false)

  const handleOpenClaimModal = (policy) => {
    setClaimModalPolicy(policy)
    setClaimAmount('')
    setClaimReason('')
    setClaimDocFile(null)
  }

  const handleClaimSubmit = async (e) => {
    e.preventDefault()
    if (!claimModalPolicy) return
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
        policyId: claimModalPolicy.id,
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
      setClaimModalPolicy(null)
      setClaimDocFile(null)
      fetchMyProfile()
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit claim.'
      toast.error(msg)
    } finally {
      setFilingClaim(false)
    }
  }

  const policies = profile?.policies || []

  const filteredPolicies = policies.filter(
    (p) =>
      p.policyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.policyType?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusVariant = (status) => {
    switch (status) {
      case 'ACTIVE': return 'success'
      case 'APPROVED': return 'info'
      case 'EXPIRED': return 'error'
      case 'CANCELLED': return 'error'
      default: return 'warning'
    }
  }

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'

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
          <h1 className="text-3xl font-extrabold text-text-primary">My Policies</h1>
          <p className="text-text-secondary">View all your insurance policies and apply for new coverage.</p>
        </div>
        <Button onClick={handleOpenApplyModal} className="flex items-center gap-2">
          <Plus className="h-4 w-4" strokeWidth={2} />
          Apply for Policy
        </Button>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      {/* Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: policies.length, color: 'text-primary' },
          { label: 'Active', value: policies.filter(p => p.status === 'ACTIVE').length, color: 'text-success' },
          { label: 'Expired', value: policies.filter(p => p.status === 'EXPIRED').length, color: 'text-error' },
          { label: 'Cancelled', value: policies.filter(p => p.status === 'CANCELLED').length, color: 'text-warning' },
        ].map((s) => (
          <Card key={s.label} className="flex flex-col items-center justify-center py-4 hover:border-border-custom text-center">
            <span className={`text-2xl font-bold ${s.color}`}>{s.value}</span>
            <span className="text-xs text-text-secondary font-semibold uppercase tracking-wider mt-1">{s.label}</span>
          </Card>
        ))}
      </div>

      <Card className="p-0 overflow-hidden hover:border-border-custom">
        {/* Search bar */}
        <div className="p-4 border-b border-border-custom bg-bg-base flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-3 flex items-center text-text-secondary pointer-events-none">
              <Search className="h-4 w-4" strokeWidth={2} />
            </span>
            <input
              type="text"
              placeholder="Search by policy number or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border-custom bg-bg-base rounded-xl text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-text-secondary"
            />
          </div>
        </div>

        {/* Policies table */}
        <div className="overflow-x-auto">
          {filteredPolicies.length === 0 ? (
            <div className="p-10 text-center">
              <FileText className="h-10 w-10 text-text-secondary mx-auto mb-3 opacity-40" />
              <p className="text-text-secondary text-sm">
                {policies.length === 0
                  ? 'No policies assigned yet. Contact your agent.'
                  : 'No policies match your search.'}
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-text-secondary border-b border-border-custom">
                  <th className="px-6 py-4">Policy No.</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Premium</th>
                  <th className="px-6 py-4">Coverage</th>
                  <th className="px-6 py-4">Start Date</th>
                  <th className="px-6 py-4">End Date</th>
                  <th className="px-6 py-4">Agent</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-custom text-text-primary">
                {filteredPolicies.map((policy) => (
                  <tr key={policy.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-semibold font-mono text-primary text-xs">
                      {policy.policyNumber}
                    </td>
                    <td className="px-6 py-4">
                      {policy.policyType?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 font-mono font-medium">
                      ${parseFloat(policy.premiumAmount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-mono text-sm">
                      ${parseFloat(policy.coverageAmount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-xs">{formatDate(policy.startDate)}</td>
                    <td className="px-6 py-4 text-xs">{formatDate(policy.endDate)}</td>
                    <td className="px-6 py-4 text-xs text-text-secondary">
                      {policy.assignedAgent?.email || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Badge variant={getStatusVariant(policy.status)}>
                          {policy.status}
                        </Badge>

                        {(policy.status === 'APPROVED' || policy.status === 'ACTIVE') && (
                          <Button
                            size="sm"
                            onClick={() => handleOpenPayModal(policy)}
                            className="text-xs py-1 px-2.5 h-auto"
                          >
                            Pay Premium
                          </Button>
                        )}

                        {policy.status === 'ACTIVE' && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleOpenClaimModal(policy)}
                            className="text-xs py-1 px-2.5 h-auto"
                          >
                            File Claim
                          </Button>
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
      {/* Apply Policy Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-lg space-y-4">
            <div className="flex items-center justify-between border-b border-border-custom pb-3">
              <h2 className="text-xl font-bold text-text-primary">Apply for New Policy</h2>
              <button
                onClick={() => setShowApplyModal(false)}
                className="text-text-secondary hover:text-text-primary p-1 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-text-primary">Policy Product / Type</label>
                <select
                  value={applyForm.policyTypeId}
                  onChange={(e) => setApplyForm({ ...applyForm, policyTypeId: e.target.value })}
                  className="w-full border border-border-custom bg-bg-base rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  required
                >
                  <option value="">Select a Policy Product</option>
                  {policyTypes.map((pt) => (
                    <option key={pt.id} value={pt.id}>
                      {pt.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="date"
                  label="Start Date"
                  value={applyForm.startDate}
                  onChange={(e) => setApplyForm({ ...applyForm, startDate: e.target.value })}
                  required
                />
                <Input
                  type="date"
                  label="End Date"
                  value={applyForm.endDate}
                  onChange={(e) => setApplyForm({ ...applyForm, endDate: e.target.value })}
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-text-primary">Notes / Additional Info</label>
                <textarea
                  placeholder="Describe your coverage needs or comments for the agent..."
                  value={applyForm.description}
                  onChange={(e) => setApplyForm({ ...applyForm, description: e.target.value })}
                  rows={3}
                  className="w-full border border-border-custom bg-bg-base rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-border-custom">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowApplyModal(false)}
                  disabled={applying}
                >
                  Cancel
                </Button>
                <Button type="submit" loading={applying}>
                  Submit Application
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
      {/* Pay Premium Modal */}
      {payModalPolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md space-y-4">
            <div className="flex items-center justify-between border-b border-border-custom pb-3">
              <h2 className="text-xl font-bold text-text-primary">Pay Premium</h2>
              <button
                onClick={() => setPayModalPolicy(null)}
                className="text-text-secondary hover:text-text-primary p-1 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handlePaySubmit} className="space-y-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-border-custom text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Policy Number:</span>
                  <span className="font-mono font-bold text-primary">{payModalPolicy.policyNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Policy Type:</span>
                  <span className="font-semibold text-text-primary">{payModalPolicy.policyType?.name || 'N/A'}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-border-custom font-bold">
                  <span className="text-text-primary">Amount Due:</span>
                  <span className="text-success font-mono">${parseFloat(payModalPolicy.premiumAmount).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-text-primary">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full border border-border-custom bg-bg-base rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                >
                  <option value="UPI">UPI</option>
                  <option value="CARD">Debit / Credit Card</option>
                  <option value="NET_BANKING">Net Banking</option>
                  <option value="CASH">Cash Deposit</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-border-custom">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setPayModalPolicy(null)}
                  disabled={paying}
                >
                  Cancel
                </Button>
                <Button type="submit" loading={paying}>
                  Confirm & Pay ${parseFloat(payModalPolicy.premiumAmount).toLocaleString()}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
      {/* File Claim Modal */}
      {claimModalPolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md space-y-4">
            <div className="flex items-center justify-between border-b border-border-custom pb-3">
              <h2 className="text-xl font-bold text-text-primary">File a Claim</h2>
              <button
                onClick={() => setClaimModalPolicy(null)}
                className="text-text-secondary hover:text-text-primary p-1 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleClaimSubmit} className="space-y-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-border-custom text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Policy Number:</span>
                  <span className="font-mono font-bold text-primary">{claimModalPolicy.policyNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Max Coverage:</span>
                  <span className="font-mono font-bold text-text-primary">
                    ${parseFloat(claimModalPolicy.coverageAmount).toLocaleString()}
                  </span>
                </div>
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
                  placeholder="Describe the incident, loss, or medical reason..."
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
                  onClick={() => setClaimModalPolicy(null)}
                  disabled={filingClaim}
                >
                  Cancel
                </Button>
                <Button type="submit" loading={filingClaim}>
                  Submit Claim
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}

export default CustomerPoliciesPage
