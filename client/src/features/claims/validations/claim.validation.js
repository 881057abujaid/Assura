import { z } from 'zod'

export const createClaimSchema = z.object({
  policyId: z.string().uuid('Please provide a valid Policy ID (UUID)'),
  claimAmount: z.coerce.number().positive('Claim amount must be greater than 0'),
  reason: z.string().trim().min(10, 'Reason must be at least 10 characters long').max(500, 'Reason cannot exceed 500 characters'),
})

export const updateClaimSchema = z.object({
  claimAmount: z.coerce.number().positive('Claim amount must be greater than 0').optional(),
  reason: z.string().trim().min(10, 'Reason must be at least 10 characters long').max(500, 'Reason cannot exceed 500 characters').optional(),
})

export const reviewClaimSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
  remarks: z.string().trim().max(500, 'Remarks cannot exceed 500 characters').optional(),
}).superRefine((data, ctx) => {
  if (data.status === 'REJECTED' && (!data.remarks || data.remarks.trim().length === 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Remarks are required when rejecting a claim.',
      path: ['remarks']
    })
  }
})
