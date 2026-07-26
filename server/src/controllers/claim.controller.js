import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { claimService } from "../services/claim.service.js";

export const claimController = {};

claimController.createClaim = asyncHandler(async (req, res) => {
    const claim = await claimService.createClaim(req.body);

    return res.status(201).json(
        new ApiResponse(
            201,
            "Claim created succesfully.",
            claim
        )
    );
});

claimController.getAllClaims = asyncHandler(async (req, res) => {
    const claims = await claimService.getAllClaims();

    return res.status(200).json(
        new ApiResponse(
            200,
            "Claims fetched successfully.",
            claims,
        )
    );
});

claimController.getClaimById = asyncHandler(async (req, res) => {
    const { claimId } = req.params;

    const claim = await claimService.getClaimById(claimId);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Claim fetched successfully.",
            claim,
        )
    );
});

claimController.updateClaim = asyncHandler(async (req, res) => {
    const { claimId } = req.params;
    const claim = await claimService.updateClaim({
        claimId,
        ...req.body,
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            "Claim updated successfully.",
            claim,
        )
    );
});

claimController.reviewClaim = asyncHandler(async (req, res) => {
    const { claimId } = req.params;
    const claim = await claimService.reviewClaim({
        claimId,
        reviewerId: req.user.id,
        ...req.body,
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            "Claim reviewed successfully.",
            claim,
        )
    );
});

claimController.deleteClaim = asyncHandler(async (req, res) => {
    const { claimId } = req.params;
    const claim = await claimService.deleteClaim(claimId);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Claim deleted successfully.",
            claim,
        )
    );
});