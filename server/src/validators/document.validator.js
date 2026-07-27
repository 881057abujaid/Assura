import { z } from "zod";

export const uploadDocumentSchema = z
    .object({
        customerId: z.uuid("Invalid customer ID.").optional(),
        claimId: z.uuid("Invalid claim ID.").optional(),
    })
    .superRefine((data, ctx) => {
        if (!data.customerId && !data.claimId) {
            ctx.addIssue({
                code: "custom",
                message: "Either customerId or claimId is required.",
                path: ["customerId"],
            });
        }

        if (data.customerId && data.claimId) {
            ctx.addIssue({
                code: "custom",
                message: "Provide either customerId or claimId, not both.",
                path: ["customerId"],
            });
        }
    });

export const getDocumentByIdSchema = z.object({
    documentId: z.uuid("Invalid document ID."),
});

export const deleteDocumentSchema = z.object({
    documentId: z.uuid("Invalid document ID."),
});