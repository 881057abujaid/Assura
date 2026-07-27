import { z } from "zod";
import { ClaimStatus } from "@prisma/client";

export const createClaimSchema = z.object({
    policyId: z
        .uuid("Policy ID must be a valid UUID."),

    claimAmount: z
        .number("Claim amount must be a number.")
        .positive("Claim amount must be greater than zero."),

    reason: z
        .string()
        .trim()
        .min(10, "Reason must be at least 10 characters long.")
        .max(500, "Reason cannot exceed 500 characters")
});

export const updateClaimSchema = z.object({
    claimAmount: z
        .number("Claim amount must be a number.")
        .positive("Claim amount must be greater than zero.")
        .optional(),

    reason: z
        .string()
        .trim()
        .min(10, "Reason must be at least 10 characters long.")
        .max(500, "Reason cannot exceed 500 characters")
        .optional(),
}).refine(
    (data) => Object.keys(data).length > 0,
    {
        message: "At least one field is required for update."
    }
);

export const reviewClaimSchema = z.object({
    status: z.enum([ClaimStatus.APPROVED, ClaimStatus.REJECTED]),

    remarks: z
        .string()
        .trim()
        .max(500, "Remarks cannot exceed 500 characters")
        .optional()
}).superRefine((data, ctx) => {
    if (data.status === ClaimStatus.REJECTED &&
        (!data.remarks || data.remarks.trim().length === 0)
    ) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Remarks are required when rejecting a claim.",
            path: ["remarks"]
        });
    }
});