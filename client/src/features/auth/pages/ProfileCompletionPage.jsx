import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, Navigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-hot-toast'

import { useAuth } from '../../../context/AuthContext'
import { Button, Input, Alert } from '../../../components/ui'
import { completeProfileSchema } from '../../customers/validations/customer.validation'
import { userService } from '../../users/services/user.service'
import AuthLayout from '../components/AuthLayout'
import AuthHeader from '../components/AuthHeader'
import AuthCard from '../components/AuthCard'

export function ProfileCompletionPage() {
  const navigate = useNavigate()
  const { updateUser, user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: {
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

  const onSubmit = async (data) => {
    setLoading(true)
    setError(null)
    try {
      const res = await userService.completeProfile(data)

      // Atomically update both React state and localStorage
      // res.data is the updated customer object returned by the API
      updateUser((prevUser) => ({
        ...prevUser,
        customer: res.data,
      }))

      toast.success('Profile completed successfully!')
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (user?.customer?.profileCompleted) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <AuthLayout>
      <AuthHeader
        title="Complete Your Profile"
        subtitle="Please fill in your demographic information to activate your insurance account."
      />

      <AuthCard className="mt-8 max-w-xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <Alert variant="error">
              {error}
            </Alert>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              type="text"
              label="Phone Number"
              placeholder="e.g. 9876543210"
              error={errors.phone?.message}
              disabled={loading}
              {...register('phone')}
            />

            <Input
              type="date"
              label="Date of Birth"
              error={errors.dob?.message}
              disabled={loading}
              {...register('dob')}
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-text-primary">Gender</label>
              <select
                {...register('gender')}
                disabled={loading}
                className="w-full border border-border-custom bg-bg-base rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
              {errors.gender && (
                <span className="text-xs text-error font-medium">{errors.gender.message}</span>
              )}
            </div>

            <Input
              type="text"
              label="Postal Code (6 digits)"
              placeholder="e.g. 110001"
              error={errors.postalCode?.message}
              disabled={loading}
              {...register('postalCode')}
            />

            <div className="sm:col-span-2">
              <Input
                type="text"
                label="Street Address"
                placeholder="e.g. 123, Park Avenue"
                error={errors.address?.message}
                disabled={loading}
                {...register('address')}
              />
            </div>

            <Input
              type="text"
              label="City"
              placeholder="e.g. New Delhi"
              error={errors.city?.message}
              disabled={loading}
              {...register('city')}
            />

            <Input
              type="text"
              label="State"
              placeholder="e.g. Delhi"
              error={errors.state?.message}
              disabled={loading}
              {...register('state')}
            />

            <div className="sm:col-span-2">
              <Input
                type="text"
                label="Country"
                placeholder="e.g. India"
                error={errors.country?.message}
                disabled={loading}
                {...register('country')}
              />
            </div>
          </div>

          <Button type="submit" loading={loading} className="w-full">
            Save & Continue to Portal
          </Button>
        </form>
      </AuthCard>
    </AuthLayout>
  )
}

export default ProfileCompletionPage
