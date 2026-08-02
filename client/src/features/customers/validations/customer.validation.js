import { z } from 'zod'

export const createCustomerSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().trim().min(8, 'Password must be at least 8 characters long'),
  fullName: z.string().trim().min(2, 'Full name must be at least 2 characters long'),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, 'Invalid phone number format (10 digits starting with 6-9)').optional().or(z.literal('')),
  dob: z.string().optional().or(z.literal('')),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  address: z.string().trim().min(5, 'Address must be at least 5 characters long').optional().or(z.literal('')),
  city: z.string().trim().min(2, 'City must be at least 2 characters long').optional().or(z.literal('')),
  state: z.string().trim().min(2, 'State must be at least 2 characters long').optional().or(z.literal('')),
  country: z.string().trim().min(2, 'Country must be at least 2 characters long').optional().or(z.literal('')),
  postalCode: z.string().trim().regex(/^\d{6}$/, 'Invalid postal code format (6 digits)').optional().or(z.literal('')),
})

export const completeProfileSchema = z.object({
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, 'Invalid phone number format (10 digits starting with 6-9)'),
  dob: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  address: z.string().trim().min(5, 'Address must be at least 5 characters long'),
  city: z.string().trim().min(2, 'City must be at least 2 characters long'),
  state: z.string().trim().min(2, 'State must be at least 2 characters long'),
  country: z.string().trim().min(2, 'Country must be at least 2 characters long'),
  postalCode: z.string().trim().regex(/^\d{6}$/, 'Invalid postal code format (6 digits)'),
})

export const updateCustomerSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name must be at least 2 characters long').optional(),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, 'Invalid phone number format (10 digits starting with 6-9)').optional(),
  dob: z.string().min(1, 'Date of birth is required').optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  address: z.string().trim().min(5, 'Address must be at least 5 characters long').optional(),
  city: z.string().trim().min(2, 'City must be at least 2 characters long').optional(),
  state: z.string().trim().min(2, 'State must be at least 2 characters long').optional(),
  country: z.string().trim().min(2, 'Country must be at least 2 characters long').optional(),
  postalCode: z.string().trim().regex(/^\d{6}$/, 'Invalid postal code format (6 digits)').optional(),
})
