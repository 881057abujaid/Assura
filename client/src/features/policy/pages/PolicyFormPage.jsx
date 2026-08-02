import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-hot-toast'
import { ArrowLeft } from 'lucide-react'

import { storage } from '../../../lib/storage'

import { Button, Input, Card, Alert, Spinner } from '../../../components/ui'

import { usePolicyForm } from '../hooks/usePolicyForm'
import { usePolicyDetail } from '../hooks/usePolicyDetail'
import { useCustomers } from '../../customers/hooks/useCustomers'
import { usePolicyTypes } from '../hooks/usePolicyTypes'
import { userService } from '../../users/services/user.service'
import { createPolicySchema, updatePolicySchema } from '../validations/policy.validation'
import { ROUTES } from '../../../config/routes'

export function PolicyFormPage() {
  const { policyId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const isEdit = Boolean(policyId)

  const { createPolicy, updatePolicy, loading, error } = usePolicyForm()
  const { fetchPolicyDetail } = usePolicyDetail()
  const { fetchCustomers, customers } = useCustomers()
  const { fetchPolicyTypes, policyTypes } = usePolicyTypes()

  const [fetchingData, setFetchingData] = useState(true)
  const [agents, setAgents] = useState([])
  const [fetchingAgents, setFetchingAgents] = useState(false)
  const currentUser = storage.getUser()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(isEdit ? updatePolicySchema : createPolicySchema),
    defaultValues: {
      customerId: searchParams.get('customerId') || '',
      policyTypeId: '',
      agentId: '',
      premiumAmount: 0,
      coverageAmount: 0,
      description: '',
      startDate: '',
      endDate: '',
      status: 'ACTIVE'
    }
  })

  useEffect(() => {
    const loadInitialData = async () => {
      setFetchingData(true)
      setFetchingAgents(true)
      try {
        await Promise.all([
          fetchCustomers(),
          fetchPolicyTypes(),
          userService.getAgents().then((res) => setAgents(res.data || [])).catch(() => { })
        ])

        if (isEdit) {
          const detail = await fetchPolicyDetail(policyId)
          if (detail?.policy) {
            const startFormatted = detail.policy.startDate
              ? new Date(detail.policy.startDate).toISOString().split('T')[0]
              : ''
            const endFormatted = detail.policy.endDate
              ? new Date(detail.policy.endDate).toISOString().split('T')[0]
              : ''

            reset({
              agentId: detail.policy.agentId || currentUser?.id || '',
              premiumAmount: parseFloat(detail.policy.premiumAmount) || 0,
              coverageAmount: parseFloat(detail.policy.coverageAmount) || 0,
              description: detail.policy.description || '',
              endDate: endFormatted,
              status: detail.policy.status || 'ACTIVE'
            })
          }
        }
      } catch (err) {
        console.error(err)
      } finally {
        setFetchingData(false)
        setFetchingAgents(false)
      }
    }

    loadInitialData()
  }, [policyId, isEdit])

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await updatePolicy(policyId, data)
        toast.success('Policy updated successfully')
        navigate(`/policies/${policyId}`)
      } else {
        await createPolicy(data)
        toast.success('Policy assigned successfully')
        navigate(ROUTES.POLICIES)
      }
    } catch {
      // Handled by hook error state
    }
  }

  if (fetchingData) {
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
          to={isEdit ? `/policies/${policyId}` : ROUTES.POLICIES}
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <h1 className="text-3xl font-extrabold text-text-primary">
          {isEdit ? 'Modify Insurance Policy' : 'Assign New Insurance Policy'}
        </h1>
        <p className="text-text-secondary">
          {isEdit
            ? 'Adjust premium amounts, coverage ceilings, or policy status.'
            : 'Fill in coverage variables and link a customer to a policy type.'}
        </p>
      </div>

      {error && (
        <Alert variant="error">
          {error}
        </Alert>
      )}

      <Card className="hover:border-border-custom max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {!isEdit && (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-text-primary">Customer Account</label>
                  <select
                    {...register('customerId')}
                    disabled={loading}
                    className="w-full border border-border-custom bg-bg-base rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  >
                    <option value="">Select a Customer</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.fullName} ({c.phone})
                      </option>
                    ))}
                  </select>
                  {errors.customerId && (
                    <span className="text-xs text-error font-medium">{errors.customerId.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-text-primary">Policy Type</label>
                  <select
                    {...register('policyTypeId')}
                    disabled={loading}
                    className="w-full border border-border-custom bg-bg-base rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  >
                    <option value="">Select a Type</option>
                    {policyTypes.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                  {errors.policyTypeId && (
                    <span className="text-xs text-error font-medium">{errors.policyTypeId.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-sm font-semibold text-text-primary">Assigned Agent</label>
                  {fetchingAgents ? (
                    <div className="text-xs text-text-secondary">Loading agents...</div>
                  ) : (
                    <select
                      {...register('agentId')}
                      disabled={loading}
                      className="w-full border border-border-custom bg-bg-base rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    >
                      <option value="">Select Agent Account</option>
                      {agents.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.email} ({a.role})
                        </option>
                      ))}
                    </select>
                  )}
                  {errors.agentId && (
                    <span className="text-xs text-error font-medium">{errors.agentId.message}</span>
                  )}
                </div>

                <Input
                  type="date"
                  label="Start Date"
                  error={errors.startDate?.message}
                  disabled={loading}
                  {...register('startDate')}
                />
              </>
            )}

            <Input
              type="date"
              label="End Date"
              error={errors.endDate?.message}
              disabled={loading}
              {...register('endDate')}
            />

            <Input
              type="number"
              step="0.01"
              label="Premium Amount ($)"
              placeholder="e.g. 150.00"
              error={errors.premiumAmount?.message}
              disabled={loading}
              {...register('premiumAmount')}
            />

            <Input
              type="number"
              step="0.01"
              label="Coverage Limit ($)"
              placeholder="e.g. 50000.00"
              error={errors.coverageAmount?.message}
              disabled={loading}
              {...register('coverageAmount')}
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-text-primary">Policy Status</label>
              <select
                {...register('status')}
                disabled={loading}
                className="w-full border border-border-custom bg-bg-base rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              >
                <option value="ACTIVE">Active</option>
                <option value="EXPIRED">Expired</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
              {errors.status && (
                <span className="text-xs text-error font-medium">{errors.status.message}</span>
              )}
            </div>

            <div className="sm:col-span-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-text-primary">Additional Description</label>
                <textarea
                  placeholder="Summarize key features, clauses, or exclusions..."
                  {...register('description')}
                  disabled={loading}
                  rows={4}
                  className="w-full border border-border-custom bg-bg-base rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                {errors.description && (
                  <span className="text-xs text-error font-medium">{errors.description.message}</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border-custom">
            <Button
              type="button"
              variant="secondary"
              disabled={loading}
              onClick={() => navigate(isEdit ? `/policies/${policyId}` : ROUTES.POLICIES)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {isEdit ? 'Save Changes' : 'Assign Policy'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default PolicyFormPage
