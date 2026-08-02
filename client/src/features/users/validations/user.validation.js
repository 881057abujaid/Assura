import { z } from 'zod'

export const updateProfileSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address'),
})

export const changePasswordSchema = z.object({
  oldPassword: z
    .string()
    .trim()
    .min(1, 'Old password is required')
    .min(8, 'Password must be at least 8 characters long'),
  newPassword: z
    .string()
    .trim()
    .min(1, 'New password is required')
    .min(8, 'New password must be at least 8 characters long'),
  confirmPassword: z
    .string()
    .trim()
    .min(1, 'Confirm password is required'),
})
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: 'New password cannot be the same as old password',
    path: ['newPassword'],
  })
