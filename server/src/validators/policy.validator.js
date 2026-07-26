import { z } from "zod";
import { PolicyStatus } from "@prisma/client";

export const createPolicySchema = z.object({
    policyNumber: z
        .string()
        .trim()
        .min(1, "Policy number is required")
        .max(50, "Policy number must be at most 50 characters"),

    customerId: z
        .uuid("Invalid customer ID"),

    policyTypeId: z
        .uuid("Invalid policy type ID"),

    agentId: z
        .uuid("Invalid agent ID"),

    premiumAmount: z
        .number()
        .positive("Premium amount must be greater than 0"),

    coverageAmount: z
        .number()
        .positive("Coverage amount must be greater than 0"),

    description: z
        .string()
        .trim()
        .max(500, "Description must be at most 500 characters")
        .optional(),

    startDate: z
        .coerce.date("Invalid start date"),

    endDate: z
        .coerce.date("Invalid end date"),

    status: z
        .nativeEnum(PolicyStatus)
        .optional(),
})
    .refine((data) => {
        if (data.startDate && data.endDate) {
            return data.endDate > data.startDate;
        }
        return true;
    }, { message: "End date must be after start date", path: ["endDate"] })


export const updatePolicySchema = z.object({
    agentId: z
        .uuid("Invalid agent ID")
        .optional(),

    premiumAmount: z
        .number()
        .positive("Premium amount must be greater than 0")
        .optional(),

    coverageAmount: z
        .number()
        .positive("Coverage amount must be greater than 0")
        .optional(),

    description: z
        .string()
        .trim()
        .max(500, "Description must be at most 500 characters")
        .optional()
        .transform(value => value?.trim()),

    endDate: z
        .coerce.date("Invalid end date")
        .optional(),

    status: z
        .nativeEnum(PolicyStatus)
        .optional(),
})
    .refine(
        (data) => Object.values(data).some(
            value => value !== undefined),
        { message: "At least one field is required" }
    )
