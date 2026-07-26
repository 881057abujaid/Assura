import { policyService } from "../services/policy.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const policyController = {};

policyController.createPolicy = asyncHandler(async (req, res) => {
    const policy = await policyService.createPolicy(req.body);

    return res.status(201).json(
        new ApiResponse(
            201,
            "Policy created successfully.",
            policy
        )
    );
});

policyController.getAllPolicies = asyncHandler(async (req, res) => {
    const policies = await policyService.getAllPolicies();

    return res.status(200).json(
        new ApiResponse(
            200,
            "Policies fetched successfully.",
            policies
        )
    );
});

policyController.getPolicyById = asyncHandler(async (req, res) => {
    const { policyId } = req.params;

    const policy = await policyService.getPolicyById(policyId);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Policy fetched successfully",
            policy
        )
    );
});

policyController.updatePolicy = asyncHandler(async (req, res) => {
    const { policyId } = req.params;

    const updatedPolicy = await policyService.updatePolicy({
        policyId,
        ...req.body
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            "Policy updated successfully",
            updatedPolicy
        )
    );
});

policyController.deletePolicy = asyncHandler(async (req, res) => {
    const { policyId } = req.params;

    const deletedPolicy = await policyService.deletePolicy(policyId);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Policy deleted successfully",
            deletedPolicy
        )
    );
});