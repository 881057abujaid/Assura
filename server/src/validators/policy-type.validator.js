import { z } from "zod";

export const createPolicyTypeSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Policy type name is required")
        .max(100, "Policy type name must be at most 100 characters long"),

    description: z
        .string()
        .trim()
        .min(1, "Policy type description is required")
        .max(500, "Policy type description must be at most 500 characters long")
        .optional()
});

export const updatePolicyTypeSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Policy type name is required")
        .max(100, "Policy type name must be at most 100 characters long")
        .optional(),

    description: z
        .string()
        .trim()
        .optional(),
})
    .refine((data) => {
        if (!data.name && !data.description) {
            return false;
        }
        return true;
    }, "At least one field must be provided");