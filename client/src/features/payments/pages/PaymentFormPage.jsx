import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-hot-toast'
import { ArrowLeft } from 'lucide-react'

import { Button, Input, Card, Alert, Spinner } from '../../../components/ui'

import { usePaymentForm } from '../hooks/usePaymentForm'
import { usePolicies } from '../../policy/hooks/usePolicies'
import { createPaymentSchema } from '../validations/payment.validation'
import { ROUTES } from '../../../config/routes'

export function PaymentFormPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const { createPaymentRecord, loading, error } = usePaymentForm()
  const { fetchPolicies, policies } = usePolicies()

  const [fetchingPolicies, setFetchingPolicies] = useState(true)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(createPaymentSchema),
    defaultValues: {
      policyId: searchParams.get('policyId') || '',
      amount: 0,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'UPI',
      transactionId: '',
      status: 'PAID'
    }
  })

  useEffect(() => {
    fetchPolicies().finally(() => setFetchingPolicies(false))
  }, [])

  const onSubmit = async (data) => {
    try {
      await createPaymentRecord(data)
      toast.success('Premium payment recorded successfully')
      
      const queryPolicyId = searchParams.get('policyId')
      if (queryPolicyId) {
        navigate(`/policies/${queryPolicyId}`)
      } else {
        navigate(ROUTES.PAYMENTS)
      }
    } catch {
      // Handled by hook error state
    }
  }

  if (fetchingPolicies) {
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
          to={searchParams.get('policyId') ? `/policies/${searchParams.get('policyId')}` : ROUTES.PAYMENTS}
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <h1 className="text-3xl font-extrabold text-text-primary">Record Premium Payment</h1>
        <p className="text-text-secondary">Track customer payments made against their active insurance contracts.</p>
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
              disabled={loading}
              className="w-full border border-border-custom bg-bg-base rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
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
            label="Payment Amount ($)"
            placeholder="e.g. 150.00"
            error={errors.amount?.message}
            disabled={loading}
            {...register('amount')}
          />

          <Input
            type="text"
            label="Reference Transaction ID"
            placeholder="e.g. TXN987654321"
            error={errors.transactionId?.message}
            disabled={loading}
            {...register('transactionId')}
          />

          <Input
            type="date"
            label="Payment Date"
            error={errors.paymentDate?.message}
            disabled={loading}
            {...register('paymentDate')}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-text-primary">Payment Method</label>
            <select
              {...register('paymentMethod')}
              disabled={loading}
              className="w-full border border-border-custom bg-bg-base rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            >
              <option value="UPI">UPI</option>
              <option value="CARD">Debit / Credit Card</option>
              <option value="NET_BANKING">Net Banking</option>
              <option value="CASH">Cash</option>
            </select>
            {errors.paymentMethod && (
              <span className="text-xs text-error font-medium">{errors.paymentMethod.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-text-primary">Payment Status</label>
            <select
              {...register('status')}
              disabled={loading}
              className="w-full border border-border-custom bg-bg-base rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            >
              <option value="PAID">Paid / Settled</option>
              <option value="PENDING">Pending / Scheduled</option>
              <option value="OVERDUE">Overdue / Delayed</option>
            </select>
            {errors.status && (
              <span className="text-xs text-error font-medium">{errors.status.message}</span>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border-custom">
            <Button
              type="button"
              variant="secondary"
              disabled={loading}
              onClick={() => navigate(searchParams.get('policyId') ? `/policies/${searchParams.get('policyId')}` : ROUTES.PAYMENTS)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Record Payment
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default PaymentFormPage
