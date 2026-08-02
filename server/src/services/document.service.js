import { Role } from "@prisma/client";
import prisma from "../lib/prisma.js";
import ApiError from "../utils/ApiError.js";
import { generateStoragePath } from "../utils/generateStoragePath.js";
import { uploadFile, deleteFile } from "../utils/storage.helper.js";

export const documentService = {};

documentService.uploadDocument = async ({ file, customerId, claimId }, userId, userRole) => {
    if (userRole === Role.CUSTOMER) {
        const customer = await prisma.customer.findUnique({
            where: { userId },
            select: { id: true },
        });

        if (!customer) {
            throw new ApiError(403, "Forbidden.");
        }

        if (customerId && customerId !== customer.id) {
            throw new ApiError(403, "You can only upload documents to your own profile.");
        }

        if (claimId) {
            const claim = await prisma.claim.findUnique({
                where: { id: claimId },
                select: { policy: { select: { customerId: true } } },
            });

            if (!claim || claim.policy?.customerId !== customer.id) {
                throw new ApiError(403, "You can only upload documents to your own claim.");
            }
        }
    }

    if (customerId) {
        const customer = await prisma.customer.findUnique({
            where: { id: customerId },
            select: { id: true },
        });

        if (!customer) {
            throw new ApiError(404, "Customer not found.");
        }
    }

    if (claimId) {
        const claim = await prisma.claim.findUnique({
            where: { id: claimId },
            select: { id: true },
        });

        if (!claim) {
            throw new ApiError(404, "Claim not found.");
        }
    }

    const storagePath = generateStoragePath({
        folder: customerId ? "customers" : "claims",
        entityId: customerId || claimId,
        originalFileName: file.originalname,
    });

    const { fileUrl } = await uploadFile({
        buffer: file.buffer,
        storagePath,
        mimeType: file.mimetype,
    });

    try {
        return await prisma.document.create({
            data: {
                fileName: file.originalname,
                fileUrl,
                storagePath,
                mimeType: file.mimetype,
                fileSize: file.size,
                customerId,
                claimId,
            },
        });
    } catch (error) {
        await deleteFile(storagePath).catch(() => {
            // Ignore cleanup errors if file deletion fails.
        });

        throw error;
    }
};

documentService.getDocumentById = async (documentId) => {
    const document = await prisma.document.findUnique({
        where: { id: documentId },
        include: {
            customer: true,
            claim: {
                select: {
                    id: true,
                    claimNumber: true,
                    status: true,
                },
            },
        },
    });

    if (!document) {
        throw new ApiError(404, "Document not found.");
    }

    return document;
};

documentService.getCustomerDocuments = async (customerId, userId, userRole) => {
    if (userRole === Role.CUSTOMER) {
        const customer = await prisma.customer.findUnique({
            where: { userId },
            select: { id: true },
        });

        if (!customer || customerId !== customer.id) {
            throw new ApiError(403, "Forbidden.");
        }
    }

    const customer = await prisma.customer.findUnique({
        where: { id: customerId },
        select: {
            id: true,
        },
    });

    if (!customer) {
        throw new ApiError(404, "Customer not found.");
    }

    return await prisma.document.findMany({
        where: { customerId },
        orderBy: {
            createdAt: "desc",
        },
    });
};

documentService.getClaimDocuments = async (claimId, userId, userRole) => {
    if (userRole === Role.CUSTOMER) {
        const customer = await prisma.customer.findUnique({
            where: { userId },
            select: { id: true },
        });

        const claim = await prisma.claim.findUnique({
            where: { id: claimId },
            select: { policy: { select: { customerId: true } } },
        });

        if (!customer || !claim || claim.policy?.customerId !== customer.id) {
            throw new ApiError(403, "Forbidden.");
        }
    }
    const claim = await prisma.claim.findUnique({
        where: { id: claimId },
        select: { id: true },
    });

    if (!claim) {
        throw new ApiError(404, "Claim not found.");
    }

    return await prisma.document.findMany({
        where: { claimId },
        orderBy: {
            createdAt: "desc",
        },
    });
};

documentService.deleteDocument = async (documentId) => {
    const document = await prisma.document.findUnique({
        where: { id: documentId },
    });

    if (!document) {
        throw new ApiError(404, "Document not found.");
    }

    try {
        await deleteFile(document.storagePath);
    } catch (_error) {
        throw new ApiError(500, "Failed to delete document from storage.");
    }

    await prisma.document.delete({
        where: {
            id: documentId,
        },
    });

    return;
};