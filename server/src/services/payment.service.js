import { PolicyStatus, Prisma, PaymentStatus, PaymentMethod } from "@prisma/client";
import prisma from "../lib/prisma.js";
import ApiError from "../utils/ApiError.js";
import generateTransactionId from "../utils/generateTransactionId.js";

export const paymentService = {};

paymentService.createPayment = async ({
    policyId,
    amount,
    paymentDate,
    paymentMethod,
    status,
}) => {
    const policy = await prisma.policy.findUnique({
        where: {
            id: policyId
        },
        select: {
            id: true,
            status: true,
            premiumAmount: true,
        },
    });

    if (!policy) {
        throw new ApiError(404, "Policy not found.");
    }

    // check policy status
    if (policy.status !== PolicyStatus.ACTIVE) {
        throw new ApiError(400, "Premium payment can only be made for active policies.");
    }

    // check if premium amount matches policy premium amount
    if (Number(amount) !== Number(policy.premiumAmount)) {
        throw new ApiError(400, "Premium amount must match policy premium amount.");
    }

    // check if there is already a pending payment for this policy
    const existingPendingPayment = await prisma.premiumPayment.findFirst({
        where: {
            policyId,
            status: PaymentStatus.PENDING,
        },
        select: {
            id: true,
        },
    })

    if (existingPendingPayment) {
        throw new ApiError(409, "A pending payment already exists for this policy.");
    }

    // Generate unique transaction Id
    let transactionId;
    let attempt = 0;

    do {
        transactionId = generateTransactionId();
        attempt++;

        if (attempt > 5) {
            throw new ApiError(500, "Failed to generate unique transaction Id.");
        }
    } while (await prisma.premiumPayment.findUnique({
        where: {
            transactionId,
        },
        select: {
            id: true,
        },
    }))

    return await prisma.premiumPayment.create({
        data: {
            policyId,
            amount: new Prisma.Decimal(amount),
            paymentDate,
            paymentMethod,
            transactionId,
            status,
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

paymentService.customerPay = async (userId, { policyId, paymentMethod }) => {
    const customer = await prisma.customer.findUnique({
        where: { userId },
    });

    if (!customer) {
        throw new ApiError(404, "Customer profile not found.");
    }

    const policy = await prisma.policy.findUnique({
        where: { id: policyId },
    });

    if (!policy) {
        throw new ApiError(404, "Policy not found.");
    }

    if (policy.customerId !== customer.id) {
        throw new ApiError(403, "You are not authorized to pay for this policy.");
    }

    if (policy.status !== PolicyStatus.APPROVED && policy.status !== PolicyStatus.ACTIVE) {
        throw new ApiError(400, "Premium payment can only be made for approved or active policies.");
    }

    let transactionId;
    let attempt = 0;

    do {
        transactionId = generateTransactionId();
        attempt++;

        if (attempt > 5) {
            throw new ApiError(500, "Failed to generate unique transaction Id.");
        }
    } while (await prisma.premiumPayment.findUnique({
        where: { transactionId },
        select: { id: true },
    }));

    const payment = await prisma.premiumPayment.create({
        data: {
            policyId,
            amount: policy.premiumAmount,
            paymentDate: new Date(),
            paymentMethod,
            transactionId,
            status: PaymentStatus.PAID,
        },
    });

    if (policy.status === PolicyStatus.APPROVED) {
        await prisma.policy.update({
            where: { id: policyId },
            data: { status: PolicyStatus.ACTIVE },
        });
    }

    return payment;
};