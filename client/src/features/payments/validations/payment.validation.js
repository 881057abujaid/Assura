import { z } from 'zod'

export const createPaymentSchema = z.object({
  policyId: z.string().uuid('Please provide a valid Policy ID (UUID)'),
  amount: z.coerce.number().positive('Payment amount must be greater than 0'),
  paymentDate: z.string().min(1, 'Payment date is required'),
  paymentMethod: z.enum(['UPI', 'CARD', 'NET_BANKING', 'CASH']),
  transactionId: z.string().trim().optional(),
  status: z.enum(['PENDING', 'PAID', 'OVERDUE']).optional(),
})

export const updatePaymentSchema = z.object({
  amount: z.coerce.number().positive('Payment amount must be greater than 0').optional(),
  paymentDate: z.string().min(1, 'Payment date is required').optional(),
  paymentMethod: z.enum(['UPI', 'CARD', 'NET_BANKING', 'CASH']).optional(),
  transactionId: z.string().trim().optional(),
  status: z.enum(['PENDING', 'PAID', 'OVERDUE']).optional(),
})
