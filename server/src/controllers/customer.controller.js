import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { customerService } from "../services/customer.service.js";

export const customerController = {};

customerController.createCustomer = asyncHandler(async (req, res) => {
    const customer = await customerService.createCustomer(req.body);

    return res.status(201).json(
        new ApiResponse(
            201,
            "Customer created successfully",
            customer,
        )
    );
});

customerController.getAllCustomers = asyncHandler(async (req, res) => {
    const customers = await customerService.getAllCustomers();

    return res.status(200).json(
        new ApiResponse(
            200,
            "Customers fetched successfully",
            customers,
        )
    );
});

customerController.getCustomerById = asyncHandler(async (req, res) => {
    const { customerId } = req.params;

    const customer = await customerService.getCustomerById(customerId);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Customer fetched successfully",
            customer,
        )
    );
});

customerController.updateCustomer = asyncHandler(async (req, res) => {
    const { customerId } = req.params;

    const customer = await customerService.updateCustomer({
        customerId,
        ...req.body
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            "Customer updated successfully",
            customer,
        )
    );
});

customerController.deleteCustomer = asyncHandler(async (req, res) => {
    const { customerId } = req.params;

    const customer = await customerService.deleteCustomer(customerId);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Customer deleted successfully",
            customer,
        )
    );
});