import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-hot-toast'

import { Button, Input, Card, Alert, Spinner } from '../../../components/ui'

import { useProfile } from '../hooks/useProfile'
import { useCustomerProfile } from '../../customers/hooks/useCustomerProfile'
import { customerService } from '../../customers/services/customer.service'
import { storage } from '../../../lib/storage'
import { updateProfileSchema, changePasswordSchema } from '../validations/user.validation'

export function ProfilePage() {
  const currentUser = storage.getUser()
  const isCustomer = currentUser?.role === 'CUSTOMER'

  const {
    fetchProfile,
    updateProfile,
    changePassword,
    userProfile,
    loading: userLoading,
    error: userError
  } = useProfile()

  const {
    fetchMyProfile,
    profile: customerProfile,
    loading: customerLoading,
    error: customerError
  } = useCustomerProfile()

  const [savingPersonal, setSavingPersonal] = useState(false)
  const [savingAddress, setSavingAddress] = useState(false)

  // Customer Forms
  const [personalForm, setPersonalForm] = useState({
    fullName: '',
    phone: '',
    dob: '',
    gender: ''
  })

  const [addressForm, setAddressForm] = useState({
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: ''
  })

  const profileForm = useForm({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      email: ''
    }
  })

  const passwordForm = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  })

  // Load initial profile values
  useEffect(() => {
    fetchProfile()
    if (isCustomer) {
      fetchMyProfile()
    }
  }, [])

  useEffect(() => {
    if (userProfile) {
      profileForm.reset({
        email: userProfile.email || ''
      })
    }
  }, [userProfile, profileForm])

  useEffect(() => {
    if (customerProfile) {
      setPersonalForm({
        fullName: customerProfile.fullName || '',
        phone: customerProfile.phone || '',
        dob: customerProfile.dob ? customerProfile.dob.split('T')[0] : '',
        gender: customerProfile.gender || ''
      })
      setAddressForm({
        address: customerProfile.address || '',
        city: customerProfile.city || '',
        state: customerProfile.state || '',
        country: customerProfile.country || '',
        postalCode: customerProfile.postalCode || ''
      })
    }
  }, [customerProfile])

  const onUpdatePersonalSubmit = async (e) => {
    e.preventDefault()
    if (!customerProfile?.id) return
    setSavingPersonal(true)
    try {
      await customerService.updateCustomer(customerProfile.id, personalForm)
      toast.success('Personal information updated successfully!')
      fetchMyProfile()
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update personal information.'
      toast.error(msg)
    } finally {
      setSavingPersonal(false)
    }
  }

  const onUpdateAddressSubmit = async (e) => {
    e.preventDefault()
    if (!customerProfile?.id) return
    setSavingAddress(true)
    try {
      await customerService.updateCustomer(customerProfile.id, addressForm)
      toast.success('Address information updated successfully!')
      fetchMyProfile()
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update address information.'
      toast.error(msg)
    } finally {
      setSavingAddress(false)
    }
  }

  const onUpdateProfileSubmit = async (data) => {
    try {
      await updateProfile(data)
      toast.success('Profile updated successfully!')
    } catch {
      // Handled by hook error state
    }
  }

  const onChangePasswordSubmit = async (data) => {
    try {
      await changePassword(data)
      toast.success('Password changed successfully!')
      passwordForm.reset()
    } catch {
      // Handled by hook error state
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-text-primary">Profile Settings</h1>
        <p className="text-text-secondary">Manage your user account credentials and security.</p>
      </div>

      {(userError || customerError) && (
        <Alert variant="error">
          {userError || customerError}
        </Alert>
      )}

      {/* Customer Specific Personal & Address Forms */}
      {isCustomer && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card className="hover:border-border-custom">
            <h2 className="text-lg font-semibold text-text-primary mb-4">Personal Information</h2>
            <form onSubmit={onUpdatePersonalSubmit} className="space-y-4">
              <Input
                label="Full Name"
                value={personalForm.fullName}
                onChange={(e) => setPersonalForm({ ...personalForm, fullName: e.target.value })}
                required
              />
              <Input
                label="Phone Number"
                placeholder="+1 555 123 4567"
                value={personalForm.phone}
                onChange={(e) => setPersonalForm({ ...personalForm, phone: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="date"
                  label="Date of Birth"
                  value={personalForm.dob}
                  onChange={(e) => setPersonalForm({ ...personalForm, dob: e.target.value })}
                />
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-text-primary">Gender</label>
                  <select
                    value={personalForm.gender}
                    onChange={(e) => setPersonalForm({ ...personalForm, gender: e.target.value })}
                    className="w-full border border-border-custom bg-bg-base rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  >
                    <option value="">Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button type="submit" loading={savingPersonal}>
                  Save Personal Info
                </Button>
              </div>
            </form>
          </Card>

          {/* Address Information */}
          <Card className="hover:border-border-custom">
            <h2 className="text-lg font-semibold text-text-primary mb-4">Address Details</h2>
            <form onSubmit={onUpdateAddressSubmit} className="space-y-4">
              <Input
                label="Street Address"
                placeholder="123 Main St, Apt 4B"
                value={addressForm.address}
                onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="City"
                  value={addressForm.city}
                  onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                />
                <Input
                  label="State / Province"
                  value={addressForm.state}
                  onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Country"
                  value={addressForm.country}
                  onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                />
                <Input
                  label="Postal Code"
                  value={addressForm.postalCode}
                  onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                />
              </div>
              <div className="flex justify-end pt-2">
                <Button type="submit" loading={savingAddress}>
                  Save Address Details
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Account Security Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <Card className="hover:border-border-custom">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Account Email</h2>
          
          <form onSubmit={profileForm.handleSubmit(onUpdateProfileSubmit)} className="space-y-4">
            <Input
              type="email"
              label="Email Address"
              placeholder="you@example.com"
              autoComplete="email"
              error={profileForm.formState.errors.email?.message}
              disabled={userLoading}
              {...profileForm.register('email')}
            />

            <div className="flex justify-end">
              <Button type="submit" loading={userLoading}>
                Save Email
              </Button>
            </div>
          </form>
        </Card>

        {/* Change Password Card */}
        <Card className="hover:border-border-custom">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Change Password</h2>

          <form onSubmit={passwordForm.handleSubmit(onChangePasswordSubmit)} className="space-y-4">
            <Input
              type="password"
              label="Current Password"
              placeholder="••••••••"
              autoComplete="current-password"
              error={passwordForm.formState.errors.oldPassword?.message}
              disabled={userLoading}
              {...passwordForm.register('oldPassword')}
            />

            <Input
              type="password"
              label="New Password"
              placeholder="••••••••"
              autoComplete="new-password"
              error={passwordForm.formState.errors.newPassword?.message}
              disabled={userLoading}
              {...passwordForm.register('newPassword')}
            />

            <Input
              type="password"
              label="Confirm New Password"
              placeholder="••••••••"
              autoComplete="new-password"
              error={passwordForm.formState.errors.confirmPassword?.message}
              disabled={userLoading}
              {...passwordForm.register('confirmPassword')}
            />

            <div className="flex justify-end">
              <Button type="submit" loading={userLoading}>
                Update Password
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}

export default ProfilePage
