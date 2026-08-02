import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams, Link, useParams } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-hot-toast'
import { ArrowLeft } from 'lucide-react'

import { Button, Input, Card, Alert, Spinner } from '../../../components/ui'

import { useClaimForm } from '../hooks/useClaimForm'
import { useClaimDetail } from '../hooks/useClaimDetail'
import { usePolicies } from '../../policy/hooks/usePolicies'
import { createClaimSchema, updateClaimSchema } from '../validations/claim.validation'
import { ROUTES } from '../../../config/routes'

export function ClaimFormPage() {
  const { claimId } = useParams()
  const isEditMode = Boolean(claimId)
  
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const { createClaimRecord, updateClaimRecord, loading, error } = useClaimForm()
  const { fetchClaimDetail, loading: detailLoading } = useClaimDetail()
  const { fetchPolicies, policies } = usePolicies()

  const [fetchingPolicies, setFetchingPolicies] = useState(true)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(isEditMode ? updateClaimSchema : createClaimSchema),
    defaultValues: {
      policyId: searchParams.get('policyId') || '',
      claimAmount: 0,
      reason: ''
    }
  })

  useEffect(() => {
    const init = async () => {
      await fetchPolicies()
      setFetchingPolicies(false)

      if (isEditMode) {
        try {
          const { claim } = await fetchClaimDetail(claimId)
          if (claim.status !== 'PENDING') {
            toast.error('Only pending claims can be updated.')
            navigate(ROUTES.CLAIMS)
            return
          }
          reset({
            policyId: claim.policyId,
            claimAmount: parseFloat(claim.claimAmount),
            reason: claim.reason
          })
        } catch {
          navigate(ROUTES.CLAIMS)
        }
      }
    }
    
    init()
  }, [claimId])

  const onSubmit = async (data) => {
    try {
      if (isEditMode) {
        await updateClaimRecord(claimId, { claimAmount: data.claimAmount, reason: data.reason })
        toast.success('Claim updated successfully')
      } else {
        await createClaimRecord(data)
        toast.success('Claim request submitted successfully')
      }
      
      const queryPolicyId = searchParams.get('policyId')
      if (queryPolicyId) {
        navigate(`/policies/${queryPolicyId}`)
      } else {
        navigate(ROUTES.CLAIMS)
      }
    } catch {
      // Handled by hook error state
    }
  }

  if (fetchingPolicies || (isEditMode && detailLoading)) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          to={searchParams.get('policyId') ? `/policies/${searchParams.get('policyId')}` : ROUTES.CLAIMS}
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <h1 className="text-3xl font-extrabold text-text-primary">
          {isEditMode ? 'Edit Claim' : 'File Payout Claim'}
        </h1>
        <p className="text-text-secondary">
          {isEditMode ? 'Update your pending claim.' : 'Submit a new claim request for review and processing.'}
        </p>
      </div>

      {error && (
        <Alert variant="error">
          {error}
        </Alert>
      )}

      <Card className="hover:border-border-custom max-w-xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-text-primary">Insurance Policy</label>
            <select
              {...register('policyId')}
              disabled={loading || isEditMode}
              className="w-full border border-border-custom bg-bg-base rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-50"
            >
              <option value="">Select a Policy</option>
              {policies.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.policyNumber} - {p.customer?.fullName}
                </option>
              ))}
            </select>
            {errors.policyId && (
              <span className="text-xs text-error font-medium">{errors.policyId.message}</span>
            )}
          </div>

          <Input
            type="number"
            step="0.01"
            label="Claim Amount ($)"
            placeholder="e.g. 5000.00"
            error={errors.claimAmount?.message}
            disabled={loading}
            {...register('claimAmount')}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-text-primary">Reason for Claim</label>
            <textarea
              placeholder="Describe the incident, damage, or medical reason for requesting payout. Minimum 10 characters..."
              {...register('reason')}
              disabled={loading}
              rows={4}
              className="w-full border border-border-custom bg-bg-base rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            {errors.reason && (
              <span className="text-xs text-error font-medium">{errors.reason.message}</span>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border-custom">
            <Button
              type="button"
              variant="secondary"
              disabled={loading}
              onClick={() => navigate(searchParams.get('policyId') ? `/policies/${searchParams.get('policyId')}` : ROUTES.CLAIMS)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {isEditMode ? 'Update Claim' : 'Submit Claim'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default ClaimFormPage
