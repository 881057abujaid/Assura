import { z } from 'zod'

export const createPolicySchema = z.object({
  customerId: z.string().uuid('Please provide a valid Customer ID (UUID)'),
  policyTypeId: z.string().uuid('Please provide a valid Policy Type ID (UUID)'),
  agentId: z.string().uuid('Please provide a valid Agent ID (UUID)'),
  premiumAmount: z.coerce.number().positive('Premium amount must be greater than 0'),
  coverageAmount: z.coerce.number().positive('Coverage amount must be greater than 0'),
  description: z.string().trim().max(500, 'Description must be at most 500 characters').optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  status: z.enum(['ACTIVE', 'EXPIRED', 'CANCELLED']).optional(),
}).refine((data) => {
  if (data.startDate && data.endDate) {
    return new Date(data.endDate) > new Date(data.startDate)
  }
  return true;
}, {
  message: 'End date must be after start date',
  path: ['endDate'],
})

export const updatePolicySchema = z.object({
  agentId: z.string().uuid('Please provide a valid Agent ID (UUID)').optional(),
  premiumAmount: z.coerce.number().positive('Premium amount must be greater than 0').optional(),
  coverageAmount: z.coerce.number().positive('Coverage amount must be greater than 0').optional(),
  description: z.string().trim().max(500, 'Description must be at most 500 characters').optional(),
  endDate: z.string().min(1, 'End date is required').optional(),
  status: z.enum(['ACTIVE', 'EXPIRED', 'CANCELLED']).optional(),
})

export const createPolicyTypeSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters long'),
  description: z.string().trim().optional(),
})

export const updatePolicyTypeSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters long').optional(),
  description: z.string().trim().optional(),
}).refine((data) => Object.values(data).some((v) => v !== undefined), {
  message: 'At least one field is required.',
})
