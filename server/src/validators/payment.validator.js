import { z } from "zod";
import { PaymentStatus, PaymentMethod } from "@prisma/client";

export const createPaymentSchema = z.object({
    policyId: z
        .uuid("Invalid policy ID."),

    amount: z
        .coerce
        .number("Amount must be a number.")
        .positive("Amount must be greater than 0."),

    paymentDate: z
        .coerce
        .date({
            error: "Invalid payment date.",
        }),

    paymentMethod: z.enum(
        [
            PaymentMethod.CASH,
            PaymentMethod.UPI,
            PaymentMethod.CARD,
            PaymentMethod.NET_BANKING],
        {
            error: "Invalid payment method.",
        }
    ),

    transactionId: z
        .string()
        .trim()
        .optional(),
});

export const updatePaymentSchema = z.object({
    amount: z
        .coerce
        .number("Amount must be a number.")
        .positive("Amount must be greater than 0.")
        .optional(),

    paymentDate: z
        .coerce
        .date()
        .optional(),

    paymentMethod: z
        .enum([
            PaymentMethod.CASH,
            PaymentMethod.UPI,
            PaymentMethod.CARD,
            PaymentMethod.NET_BANKING
        ])
        .optional(),

    transactionId: z
        .string()
        .trim()
        .optional(),

    status: z
        .enum([PaymentStatus.PENDING, PaymentStatus.PAID, PaymentStatus.OVERDUE])
        .optional(),
});

export const getPaymentByIdSchema = z.object({
    paymentId: z
        .uuid("Invalid payment ID."),
});

export const deletePaymentSchema = z.object({
    paymentId: z
        .uuid("Invalid payment ID."),
});

export const getPolicyPaymentsSchema = z.object({
    policyId: z
        .uuid("Invalid policy ID."),
});