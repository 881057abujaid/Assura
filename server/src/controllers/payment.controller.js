import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { paymentService } from "../services/payment.service.js";

export const paymentController = {};

paymentController.createPayment = asyncHandler(async (req, res) => {
    const payment = await paymentService.createPayment(req.body);

    return res.status(201).json(
        new ApiResponse(
            201,
            "Payment created successfully.",
            payment,
        )
    );
});

paymentController.getAllPayments = asyncHandler(async (req, res) => {
    const payments = await paymentService.getAllPayments();

    return res.status(200).json(
        new ApiResponse(
            200,
            "Payments retrieved successfully.",
            payments,
        )
    );
});

paymentController.getPaymentById = asyncHandler(async (req, res) => {
    const { paymentId } = req.params;

    const payment = await paymentService.getPaymentById(paymentId);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Payment retrieved successfully.",
            payment,
        )
    );
});



paymentController.deletePayment = asyncHandler(async (req, res) => {
    const { paymentId } = req.params;

    await paymentService.deletePayment(paymentId);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Payment deleted successfully.",
            null,
        )
    );
});

paymentController.getPolicyPayments = asyncHandler(async (req, res) => {
    const { policyId } = req.params;

    const payments = await paymentService.getPolicyPayments(policyId);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Policy payments retrieved successfully.",
            payments,
        )
    );
});

paymentController.customerPay = asyncHandler(async (req, res) => {
    const payment = await paymentService.customerPay(req.user.id, req.body);

    return res.status(201).json(
        new ApiResponse(
            201,
            "Premium payment completed successfully.",
            payment,
        )
    );
});