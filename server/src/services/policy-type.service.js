import ApiError from "../utils/ApiError.js";
import prisma from "../lib/prisma.js";

export const policyTypeService = {};

policyTypeService.createPolicyType = async ({ name, description }) => {
    // Check if policy type already exists
    const existingPolicyType = await prisma.policyType.findUnique({
        where: {
            name,
        },
    });

    if (existingPolicyType) {
        throw new ApiError(409, "Policy type already exists.");
    }

    // Create new Policy Type
    const policyType = await prisma.policyType.create({
        data: {
            name,
            description,
        },
    });

    return policyType;
};

policyTypeService.getAllPolicyTypes = async () => {
    // Fetch all policy types in descending order of creation date
    const policyTypes = await prisma.policyType.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });

    return policyTypes;
};

policyTypeService.getPolicyTypeById = async (policyTypeId) => {
    // Find policy type by ID
    const policyType = await prisma.policyType.findUnique({
        where: {
            id: policyTypeId,
        },
    });

    if (!policyType) {
        throw new ApiError(404, "Policy type not found.");
    }

    return policyType;
};

policyTypeService.updatePolicyType = async ({ policyTypeId, name, description }) => {
    // Find existing policy type by ID
    const existingPolicyType = await prisma.policyType.findUnique({
        where: {
            id: policyTypeId,
        },
    });

    // Check if policy type exists
    if (!existingPolicyType) {
        throw new ApiError(404, "Policy type not found.");
    }

    if (name) {
        // Check if updated policy type name is same as existing policy type name
        if (existingPolicyType.name === name) {
            throw new ApiError(409, "Please provide a different policy type name.");
        }

        // Check if updated policy type name is already exists in DB
        const existingPolicyTypeByName = await prisma.policyType.findUnique({
            where: {
                name,
            },
        });

        if (existingPolicyTypeByName) {
            throw new ApiError(409, "Policy type with this name already exists.");
        }
    }

    // Update policy type
    const updatedPolicyType = await prisma.policyType.update({
        where: {
            id: policyTypeId,
        },
        data: {
            name,
            description,
        },
    });

    return updatedPolicyType;
};

policyTypeService.deletePolicyType = async (policyTypeId) => {
    // Find policy type by ID
    const existingPolicyType = await prisma.policyType.findUnique({
        where: {
            id: policyTypeId,
        },
    });

    // Check if policy type exists
    if (!existingPolicyType) {
        throw new ApiError(404, "Policy type not found.");
    }

    // Check if policy type is associated with any policies
    const policyUsingType = await prisma.policy.findFirst({
        where: {
            policyTypeId,
        },
    });

    if (policyUsingType) {
        throw new ApiError(409, "Policy type is associated with policies. Cannot delete.");
    }

    // Delete policy type
    await prisma.policyType.delete({
        where: {
            id: policyTypeId,
        },
    });
};