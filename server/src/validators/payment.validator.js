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
});

export const customerPaySchema = z.object({
    policyId: z
        .uuid("Invalid policy ID."),

    paymentMethod: z.enum(
        [
            PaymentMethod.CASH,
            PaymentMethod.UPI,
            PaymentMethod.CARD,
            PaymentMethod.NET_BANKING
        ],
        {
            error: "Invalid payment method.",
        }
    ),
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