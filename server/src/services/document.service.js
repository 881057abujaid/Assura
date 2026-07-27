import prisma from "../lib/prisma.js";
import ApiError from "../utils/ApiError.js";
import { generateStoragePath } from "../utils/generateStoragePath.js";
import { uploadFile, deleteFile } from "../utils/storage.helper.js";

export const documentService = {};

documentService.uploadDocument = async ({ file, customerId, claimId }) => {
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
        try {
            await deleteFile(storagePath);
        } catch (_) { }

        throw error;
    }
};

documentService.getDocumentById = async (documentId) => {
    const document = await prisma.document.findUnique({
        where: { id: documentId },
        include: {
            customer: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                },
            },
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

documentService.getCustomerDocuments = async (customerId) => {
    const customer = await prisma.customer.findUnique({
        where: { id: customerId },
        select: {
            id: true,
            fileName: true,
            fileUrl: true,
            storagePath: true,
            mimeType: true,
            fileSize: true,
            createdAt: true,
        },
        orderBy: {
            createdAt: "desc",
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

documentService.getClaimDocuments = async (claimId) => {
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
    } catch (_) {
        throw new ApiError(500, "Failed to delete document from storage.");
    }

    await prisma.document.delete({
        where: {
            id: documentId,
        },
    });

    return;
};