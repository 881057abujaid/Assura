import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { documentService } from "../services/document.service.js";

export const documentController = {};

documentController.uploadDocument = asyncHandler(async (req, res) => {
    const { customerId, claimId } = req.body;
    const file = req.file;

    if (!file) {
        throw new ApiError(400, "File is required.");
    }

    const document = await documentService.uploadDocument(
        {
            file: req.file,
            customerId,
            claimId,
        },
        req.user.id,
        req.user.role
    );

    return res.status(201).json(
        new ApiResponse(
            201,
            "Document uploaded successfully.",
            document
        )
    );
});

documentController.getDocumentById = asyncHandler(async (req, res) => {
    const { documentId } = req.params;

    const document = await documentService.getDocumentById(documentId, req.user.id, req.user.role);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Document retrieved successfully.",
            document
        )
    );
});

documentController.getCustomerDocuments = asyncHandler(async (req, res) => {
    const { customerId } = req.params;

    const documents = await documentService.getCustomerDocuments(customerId, req.user.id, req.user.role);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Customer documents retrieved successfully.",
            documents
        )
    );
});

documentController.getClaimDocuments = asyncHandler(async (req, res) => {
    const { claimId } = req.params;

    const documents = await documentService.getClaimDocuments(claimId, req.user.id, req.user.role);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Claim documents retrieved successfully.",
            documents
        )
    );
});

documentController.deleteDocument = asyncHandler(async (req, res) => {
    const { documentId } = req.params;

    await documentService.deleteDocument(documentId);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Document deleted successfully.",
            null
        )
    );
});