import { useState } from 'react'

import { userService } from '../services/user.service'

export function useProfile() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [userProfile, setUserProfile] = useState(null)

  const fetchProfile = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await userService.getProfile()
      setUserProfile(data.data)
      return data
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch user profile.'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (formData) => {
    setLoading(true)
    setError(null)
    try {
      const data = await userService.updateProfile(formData)
      setUserProfile(data.data)
      return data
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update user profile.'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const changePassword = async (passwordData) => {
    setLoading(true)
    setError(null)
    try {
      const data = await userService.changePassword(passwordData)
      return data
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to change password.'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    fetchProfile,
    updateProfile,
    changePassword,
    userProfile,
    loading,
    error,
  }
}
