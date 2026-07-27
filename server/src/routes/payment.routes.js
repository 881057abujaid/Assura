import { Router } from "express";
import { paymentController } from "../controllers/payment.controller.js";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { Role } from "@prisma/client";
import {
    createPaymentSchema,
    deletePaymentSchema,
    getPaymentByIdSchema,
    getPolicyPaymentsSchema,
    updatePaymentSchema,
} from "../validators/payment.validator.js";

const router = Router();

router.use(verifyJWT);

router.post(
    "/",
    authorizeRoles(Role.ADMIN, Role.AGENT),
    validate(createPaymentSchema),
    paymentController.createPayment
);

router.get(
    "/",
    authorizeRoles(Role.ADMIN, Role.AGENT),
    paymentController.getAllPayments
);

router.get(
    "/policy/:policyId",
    authorizeRoles(Role.ADMIN, Role.AGENT),
    validate(getPolicyPaymentsSchema, "params"),
    paymentController.getPolicyPayments
);

router.get(
    "/:paymentId",
    authorizeRoles(Role.ADMIN, Role.AGENT),
    validate(getPaymentByIdSchema, "params"),
    paymentController.getPaymentById
);

router.patch(
    "/:paymentId",
    authorizeRoles(Role.ADMIN, Role.AGENT),
    validate(getPaymentByIdSchema, "params"),
    validate(updatePaymentSchema),
    paymentController.updatePayment
);

router.delete(
    "/:paymentId",
    authorizeRoles(Role.ADMIN),
    validate(deletePaymentSchema, "params"),
    paymentController.deletePayment
);

export default router;