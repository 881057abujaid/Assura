import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-hot-toast'
import { ArrowLeft } from 'lucide-react'

import { Button, Input, Card, Alert } from '../../../components/ui'

import { usePolicyTypes } from '../hooks/usePolicyTypes'
import { createPolicyTypeSchema, updatePolicyTypeSchema } from '../validations/policy.validation'
import { ROUTES } from '../../../config/routes'

export function PolicyTypeFormPage() {
  const navigate = useNavigate()
  const { policyTypeId } = useParams()
  const isEdit = Boolean(policyTypeId)

  const {
    fetchPolicyTypes,
    createPolicyTypeRecord,
    updatePolicyTypeRecord,
    policyTypes,
    loading,
    error,
  } = usePolicyTypes()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(isEdit ? updatePolicyTypeSchema : createPolicyTypeSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  // In edit mode: load all types then pre-fill the form with the matching one
  useEffect(() => {
    if (isEdit) {
      fetchPolicyTypes()
    }
  }, [isEdit])

  useEffect(() => {
    if (isEdit && policyTypes.length > 0) {
      const existing = policyTypes.find((t) => t.id === policyTypeId)
      if (existing) {
        reset({
          name: existing.name ?? '',
          description: existing.description ?? '',
        })
      }
    }
  }, [policyTypes, isEdit, policyTypeId])

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await updatePolicyTypeRecord(policyTypeId, data)
        toast.success('Policy type updated successfully')
      } else {
        await createPolicyTypeRecord(data)
        toast.success('Policy type created successfully')
      }
      navigate(ROUTES.POLICY_TYPES)
    } catch {
      // Handled by hook error state
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          to={ROUTES.POLICY_TYPES}
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <h1 className="text-3xl font-extrabold text-text-primary">
          {isEdit ? 'Edit Policy Type' : 'Create Policy Type'}
        </h1>
        <p className="text-text-secondary">
          {isEdit
            ? 'Update the name or description of this insurance product class.'
            : 'Register a new class of insurance products (e.g. Property, Travel).'}
        </p>
      </div>

      {error && (
        <Alert variant="error">
          {error}
        </Alert>
      )}

      <Card className="hover:border-border-custom max-w-xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            type="text"
            label="Type Name"
            placeholder="e.g. Home Insurance"
            error={errors.name?.message}
            disabled={loading}
            {...register('name')}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-text-primary">Description</label>
            <textarea
              placeholder="Provide information on coverage domains and general rules..."
              {...register('description')}
              disabled={loading}
              rows={4}
              className="w-full border border-border-custom bg-bg-base rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            {errors.description && (
              <span className="text-xs text-error font-medium">{errors.description.message}</span>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border-custom">
            <Button
              type="button"
              variant="secondary"
              disabled={loading}
              onClick={() => navigate(ROUTES.POLICY_TYPES)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {isEdit ? 'Save Changes' : 'Create Type'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default PolicyTypeFormPage
