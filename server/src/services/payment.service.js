import { PolicyStatus, Prisma } from "@prisma/client";
import prisma from "../lib/prisma.js";
import ApiError from "../utils/ApiError.js";
import { PaymentStatus } from "@prisma/client";

export const paymentService = {};

paymentService.createPayment = async ({
    policyId,
    amount,
    paymentDate,
    paymentMethod,
    transactionId,
}) => {
    const policy = await prisma.policy.findUnique({
        where: {
            id: policyId
        },
        select: {
            id: true,
            status: true,
        },
    });

    if (!policy) {
        throw new ApiError(404, "Policy not found.");
    }

    if (policy.status !== PolicyStatus.ACTIVE) {
        throw new ApiError(400, "Premium payment can only be made for active policies.");
    }

    const existingPendingPayment = await prisma.premiumPayment.findFirst({
        where: {
            policyId,
            status: PaymentStatus.PENDING,
        },
        select: {
            id: true,
        },
    });

    if (existingPendingPayment) {
        throw new ApiError(409, "A pending payment already exists for this policy.");
    }

    return await prisma.premiumPayment.create({
        data: {
            policyId,
            amount: new Prisma.Decimal(amount),
            paymentDate,
            paymentMethod,
            transactionId,
        },
    });
};

paymentService.getAllPayments = async () => {
    const payments = await prisma.premiumPayment.findMany({
        include: {
            policy: {
                select: {
                    id: true,
                    policyNumber: true,
                    status: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return payments;
};

paymentService.getPaymentById = async (paymentId) => {
    const payment = await prisma.premiumPayment.findUnique({
        where: {
            id: paymentId,
        },
        include: {
            policy: {
                select: {
                    id: true,
                    policyNumber: true,
                    status: true,
                },
            },
        },
    });

    if (!payment) {
        throw new ApiError(404, "Payment not found.");
    }

    return payment;
};

paymentService.updatePayment = async (paymentId, payload) => {
    const payment = await prisma.premiumPayment.findUnique({
        where: {
            id: paymentId,
        },
    });

    if (!payment) {
        throw new ApiError(404, "Payment not found.");
    }

    if (payload.amount) {
        payload.amount = new Prisma.Decimal(payload.amount);
    }

    return await prisma.premiumPayment.update({
        where: {
            id: paymentId,
        },
        data: payload,
    });
};

paymentService.deletePayment = async (paymentId) => {
    const payment = await prisma.premiumPayment.findUnique({
        where: {
            id: paymentId,
        },
        select: {
            id: true,
        },
    });

    if (!payment) {
        throw new ApiError(404, "Payment not found.");
    }

    await prisma.premiumPayment.delete({
        where: {
            id: paymentId,
        },
    });
};

paymentService.getPolicyPayments = async (policyId) => {
    const policy = await prisma.policy.findUnique({
        where: {
            id: policyId,
        },
        select: {
            id: true,
        },
    });

    if (!policy) {
        throw new ApiError(404, "Policy not found.");
    }

    return await prisma.premiumPayment.findMany({
        where: {
            policyId,
        },
        orderBy: {
            paymentDate: "desc",
        },
    });
};