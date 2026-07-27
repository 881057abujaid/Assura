import prisma from "../lib/prisma.js";
import ApiError from "../utils/ApiError.js";
import { Role } from "@prisma/client";
import { generatePolicyNumber } from "../utils/generatePolicyNumber.js";

export const policyService = {};

policyService.createPolicy = async (data) => {
    // Destructure the data
    const {
        customerId,
        policyTypeId,
        agentId,
        premiumAmount,
        coverageAmount,
        description,
        startDate,
        endDate,
        status
    } = data;

    // Check if the customer exists
    const customer = await prisma.customer.findUnique({
        where: {
            id: customerId,
        },
    });

    if (!customer) {
        throw new ApiError(404, "Customer not found.");
    }

    // Check policy type
    const policyType = await prisma.policyType.findUnique({
        where: {
            id: policyTypeId,
        },
    });

    if (!policyType) {
        throw new ApiError(404, "Policy Type not found.");
    }

    // Check agent existence
    const agent = await prisma.user.findUnique({
        where: {
            id: agentId,
        },
    });

    if (!agent) {
        throw new ApiError(404, "Agent not found.");
    }

    // Validate role
    if (agent.role !== Role.AGENT) {
        throw new ApiError(400, "Assigned user is not an agent.");
    }

    // Generate policy number
    const policyNumber = await generatePolicyNumber();

    // Create policy
    const policy = await prisma.policy.create({
        data: {
            policyNumber,
            customerId,
            policyTypeId,
            agentId,
            premiumAmount,
            coverageAmount,
            description,
            startDate,
            endDate,
            status,
        },
    });

    return policy;
};

policyService.getAllPolicies = async () => {
    // Fetch all policies
    const policies = await prisma.policy.findMany({
        include: {
            customer: true,
            policyType: true,
            assignedAgent: true,
        },
        orderBy: {
            createdAt: "desc"
        },
    });

    return policies;
};

policyService.getPolicyById = async (policyId) => {
    // Validate the policy ID format
    if (!policyId) {
        throw new ApiError(400, "Policy ID is required.");
    }

    // Find policy by id
    const policy = await prisma.policy.findUnique({
        where: {
            id: policyId,
        },
        include: {
            customer: true,
            policyType: true,
            assignedAgent: true,
        },
    });

    if (!policy) {
        throw new ApiError(404, "Policy not found.");
    }

    return policy;
};

policyService.updatePolicy = async (data) => {
    // Destructure the data
    const {
        policyId,
        agentId,
        premiumAmount,
        coverageAmount,
        description,
        endDate,
        status,
    } = data;

    // Check if policy exists
    const existingPolicy = await prisma.policy.findUnique({
        where: {
            id: policyId,
        },
    });

    if (!existingPolicy) {
        throw new ApiError(404, "Policy not found.");
    }

    // Validate agent
    if (agentId) {
        const agent = await prisma.user.findUnique({
            where: {
                id: agentId,
            },
        });

        if (!agent) {
            throw new ApiError(404, "Agent not found.");
        }

        if (agent.role !== Role.AGENT) {
            throw new ApiError(400, "Assigned user is not an agent.");
        }
    }

    // Validate end date
    if (endDate && endDate <= existingPolicy.startDate) {
        throw new ApiError(400, "End date must be after the start date.");
    }

    // Update policy
    const updatedPolicy = await prisma.policy.update({
        where: {
            id: policyId,
        },
        data: {
            agentId,
            premiumAmount,
            coverageAmount,
            description,
            endDate,
            status,
        },
    });

    return updatedPolicy;
};

policyService.deletePolicy = async (policyId) => {
    const policy = await prisma.policy.findUnique({
        where: {
            id: policyId,
        },
        include: {
            claims: true,
            premiumPayments: true,
        },
    });

    if (!policy) {
        throw new ApiError(404, "Policy not found");
    }

    if (policy.claims.length > 0) {
        throw new ApiError(
            409,
            "Policy has associated claims"
        );
    }

    if (policy.premiumPayments.length > 0) {
        throw new ApiError(
            409,
            "Policy has premium payment records"
        );
    }

    const deletedPolicy = await prisma.policy.delete({
        where: {
            id: policyId,
        },
    });

    return deletedPolicy;
};