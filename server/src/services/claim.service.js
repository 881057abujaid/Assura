import { ClaimStatus, PolicyStatus, Role } from "@prisma/client";
import { generateClaimNumber } from "../utils/generateClaimNumber.js";
import prisma from "../lib/prisma.js";
import ApiError from "../utils/ApiError.js";

export const claimService = {};

claimService.createClaim = async (data) => {
    // Destructure the data
    const {
        policyId,
        claimAmount,
        reason,
    } = data;

    // Check if policy exists
    const policy = await prisma.policy.findUnique({
        where: {
            id: policyId,
        },
        select: {
            id: true,
            status: true,
        },
    });

    if (!policy) {
        throw new ApiError(404, "Policy not found.");
    }

    // Check policy status
    if (policy.status !== PolicyStatus.ACTIVE) {
        throw new ApiError(400, "claims can only be created for active policies.");
    }

    // Check existing pending claim
    const existingPendingClaim = await prisma.claim.findFirst({
        where: {
            policyId,
            status: ClaimStatus.PENDING
        },
    });

    if (existingPendingClaim) {
        throw new ApiError(409, "A pending claim already exists for this policy.");
    }

    // Generate unique claim ID
    let claimNumber;
    let attempts = 0;

    do {
        claimNumber = generateClaimNumber();
        attempts++;

        if (attempts > 5) {
            throw new ApiError(500, "Failed to generate a unique claim number. Please try again later.");
        }
    } while (await prisma.claim.findUnique({
        where: {
            claimNumber,
        },
    }));

    // Create claim
    const claim = await prisma.claim.create({
        data: {
            claimNumber,
            policyId,
            claimAmount,
            reason,
        },
    });

    return claim;
};

claimService.getAllClaims = async () => {
    // Fetch all claims
    const claims = await prisma.claim.findMany({
        include: {
            policy: {
                select: {
                    id: true,
                    policyNumber: true,
                    status: true,
                },
            },
            reviewer: {
                select: {
                    id: true,
                    email: true,
                    role: true
                },
            },
            documents: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return claims;
};

claimService.getClaimById = async (claimId) => {
    // validate claimId
    if (!claimId) {
        throw new ApiError(400, "Claim ID is required.");
    }

    // Fetch claim by ID
    const claim = await prisma.claim.findUnique({
        where: {
            id: claimId,
        },
        include: {
            policy: {
                select: {
                    id: true,
                    policyNumber: true,
                    status: true,
                },
            },
            reviewer: {
                select: {
                    id: true,
                    email: true,
                    role: true
                },
            },
            documents: true,
        },
    });

    if (!claim) {
        throw new ApiError(404, "Claim not found.");
    }

    return claim;
};

claimService.updateClaim = async (data) => {
    // Destructure data
    const {
        claimId,
        claimAmount,
        reason,
    } = data;

    // Check if claim exists
    const existingClaim = await prisma.claim.findUnique({
        where: {
            id: claimId,
        },
    });

    if (!existingClaim) {
        throw new ApiError(404, "Claim not found.");
    }

    // Check if claim is pending
    if (existingClaim.status !== ClaimStatus.PENDING) {
        throw new ApiError(
            400,
            "Only pending claims can be updated."
        );
    }

    // Update claim
    const updatedClaim = await prisma.claim.update({
        where: {
            id: claimId,
        },
        data: {
            claimAmount,
            reason,
        },
    });

    return updatedClaim;
};

claimService.reviewClaim = async (data) => {
    // Destructure data
    const {
        claimId,
        status,
        remarks,
        reviewerId,
    } = data;

    // Check if claim exists
    const claim = await prisma.claim.findUnique({
        where: {
            id: claimId,
        },
    });

    if (!claim) {
        throw new ApiError(404, "Claim not found.");
    }

    // Check if claim is pending
    if (claim.status !== ClaimStatus.PENDING) {
        throw new ApiError(
            400,
            "Claim has already been reviewed."
        );
    }

    // Check if reviewer exists
    const reviewer = await prisma.user.findUnique({
        where: {
            id: reviewerId,
        },
        select: {
            id: true,
            role: true
        },
    });

    if (!reviewer) {
        throw new ApiError(404, "Reviewer not found.");
    }

    //Check if reviewer is authorized
    if (
        reviewer.role !== Role.ADMIN &&
        reviewer.role !== Role.AGENT
    ) {
        throw new ApiError(
            400,
            "Only admin or agent can review claims."
        );
    }

    // Update claim
    const reviewedClaim = await prisma.claim.update({
        where: {
            id: claimId,
        },
        data: {
            status,
            remarks,
            reviewedBy: reviewerId,
            reviewedAt: new Date(),
            resolvedAt: new Date(),
        },
    });

    return reviewedClaim;
};

claimService.deleteClaim = async (claimId) => {
    // Check if claim exists
    const claim = await prisma.claim.findUnique({
        where: {
            id: claimId,
        },
    });

    if (!claim) {
        throw new ApiError(404, "Claim not found.");
    }

    // Check if claim is pending
    if (claim.status !== ClaimStatus.PENDING) {
        throw new ApiError(
            400,
            "Only pending claims can be deleted."
        );
    }

    // Delete claim
    const deletedClaim = await prisma.claim.delete({
        where: {
            id: claimId,
        },
    });

    return deletedClaim;
};