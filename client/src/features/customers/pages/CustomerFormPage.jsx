import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-hot-toast'
import { ArrowLeft } from 'lucide-react'

import { Button, Input, Card, Alert } from '../../../components/ui'

import { useCustomerForm } from '../hooks/useCustomerForm'
import { useCustomerDetail } from '../hooks/useCustomerDetail'
import { createCustomerSchema, updateCustomerSchema } from '../validations/customer.validation'
import { ROUTES } from '../../../config/routes'

export function CustomerFormPage() {
  const { customerId } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(customerId)
  
  const { createCustomer, updateCustomer, loading, error } = useCustomerForm()
  const { fetchCustomerDetail } = useCustomerDetail()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(isEdit ? updateCustomerSchema : createCustomerSchema),
    defaultValues: {
      email: '',
      password: '',
      fullName: '',
      phone: '',
      dob: '',
      gender: 'MALE',
      address: '',
      city: '',
      state: '',
      country: 'India',
      postalCode: ''
    }
  })

  // Load existing customer data if edit mode is active
  useEffect(() => {
    if (isEdit) {
      fetchCustomerDetail(customerId).then((res) => {
        if (res?.customer) {
          const dobFormatted = res.customer.dob
            ? new Date(res.customer.dob).toISOString().split('T')[0]
            : ''
          reset({
            fullName: res.customer.fullName || '',
            phone: res.customer.phone || '',
            dob: dobFormatted,
            gender: res.customer.gender || 'MALE',
            address: res.customer.address || '',
            city: res.customer.city || '',
            state: res.customer.state || '',
            country: res.customer.country || 'India',
            postalCode: res.customer.postalCode || ''
          })
        }
      })
    }
  }, [customerId, isEdit])

  const onSubmit = async (data) => {
    // Clean up empty optional fields
    const payload = { ...data }
    if (!payload.phone) delete payload.phone
    if (!payload.dob) delete payload.dob
    if (!payload.address) delete payload.address
    if (!payload.city) delete payload.city
    if (!payload.state) delete payload.state
    if (!payload.postalCode) delete payload.postalCode

    try {
      if (isEdit) {
        await updateCustomer(customerId, payload)
        toast.success('Customer updated successfully')
        navigate(`/customers/${customerId}`)
      } else {
        await createCustomer(payload)
        toast.success('Customer created successfully')
        navigate(ROUTES.CUSTOMERS)
      }
    } catch {
      // Handled by hook error state
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          to={isEdit ? `/customers/${customerId}` : ROUTES.CUSTOMERS}
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <h1 className="text-3xl font-extrabold text-text-primary">
          {isEdit ? 'Edit Customer Profile' : 'Register New Customer'}
        </h1>
        <p className="text-text-secondary">
          {isEdit
            ? 'Modify customer account details and address information.'
            : 'Create a new customer user account and setup their profile.'}
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
                <div className="sm:col-span-2">
                  <h3 className="text-base font-bold text-text-primary border-b border-border-custom pb-2 mb-2">
                    Account Credentials
                  </h3>
                </div>
                <Input
                  type="email"
                  label="Email Address"
                  placeholder="customer@example.com"
                  error={errors.email?.message}
                  disabled={loading}
                  {...register('email')}
                />
                <Input
                  type="password"
                  label="Temporary Password"
                  placeholder="••••••••"
                  error={errors.password?.message}
                  disabled={loading}
                  {...register('password')}
                />
                <div className="sm:col-span-2">
                  <h3 className="text-base font-bold text-text-primary border-b border-border-custom pb-2 mb-2 mt-2">
                    Profile Details
                  </h3>
                </div>
              </>
            )}

            <Input
              type="text"
              label="Full Name"
              placeholder="John Doe"
              error={errors.fullName?.message}
              disabled={loading}
              {...register('fullName')}
            />

            <Input
              type="text"
              label="Phone Number"
              placeholder="9876543210 (Optional)"
              error={errors.phone?.message}
              disabled={loading}
              {...register('phone')}
            />

            <Input
              type="date"
              label="Date of Birth (Optional)"
              error={errors.dob?.message}
              disabled={loading}
              {...register('dob')}
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-text-primary">Gender (Optional)</label>
              <select
                {...register('gender')}
                disabled={loading}
                className="w-full border border-border-custom bg-bg-base rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-50"
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
              {errors.gender && (
                <span className="text-xs text-error font-medium">{errors.gender.message}</span>
              )}
            </div>

            <div className="sm:col-span-2">
              <Input
                type="text"
                label="Street Address (Optional)"
                placeholder="123 Main St, Apartment 4B"
                error={errors.address?.message}
                disabled={loading}
                {...register('address')}
              />
            </div>

            <Input
              type="text"
              label="City (Optional)"
              placeholder="Mumbai"
              error={errors.city?.message}
              disabled={loading}
              {...register('city')}
            />

            <Input
              type="text"
              label="State (Optional)"
              placeholder="Maharashtra"
              error={errors.state?.message}
              disabled={loading}
              {...register('state')}
            />

            <Input
              type="text"
              label="Country (Optional)"
              placeholder="India"
              error={errors.country?.message}
              disabled={loading}
              {...register('country')}
            />

            <Input
              type="text"
              label="Postal Code (Optional)"
              placeholder="400001"
              error={errors.postalCode?.message}
              disabled={loading}
              {...register('postalCode')}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border-custom">
            <Button
              type="button"
              variant="secondary"
              disabled={loading}
              onClick={() => navigate(isEdit ? `/customers/${customerId}` : ROUTES.CUSTOMERS)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {isEdit ? 'Save Changes' : 'Register Customer'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default CustomerFormPage
