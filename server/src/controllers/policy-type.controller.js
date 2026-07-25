import { policyTypeService } from "../services/policy-type.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const policyTypeController = {};

policyTypeController.createPolicyType = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    const createdPolicyType = await policyTypeService.createPolicyType({
        name,
        description
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            "Policy type created successfully",
            createdPolicyType,
        )
    );
});

policyTypeController.getAllPolicyTypes = asyncHandler(async (req, res) => {
    const policyTypes = await policyTypeService.getAllPolicyTypes();

    return res.status(200).json(
        new ApiResponse(
            200,
            "Policy types fetched successfully",
            policyTypes
        )
    );
});

policyTypeController.getPolicyTypeById = asyncHandler(async (req, res) => {
    const { policyTypeId } = req.params;

    const policyType = await policyTypeService.getPolicyTypeById(policyTypeId);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Policy type fetched successfully",
            policyType
        )
    );
});

policyTypeController.updatePolicyType = asyncHandler(async (req, res) => {
    const { policyTypeId } = req.params;
    const { name, description } = req.body;

    const updatedPolicyType = await policyTypeService.updatePolicyType({ policyTypeId, name, description });

    return res.status(200).json(
        new ApiResponse(
            200,
            "Policy type updated successfully",
            updatedPolicyType
        )
    );
});

policyTypeController.deletePolicyType = asyncHandler(async (req, res) => {
    const { policyTypeId } = req.params;

    await policyTypeService.deletePolicyType(policyTypeId);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Policy type deleted successfully"
        )
    );
});

export default policyTypeController;