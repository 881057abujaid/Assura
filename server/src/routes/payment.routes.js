import { Router } from "express";
import { paymentController } from "../controllers/payment.controller.js";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { Role } from "@prisma/client";
import {
    createPaymentSchema,
    customerPaySchema,
    deletePaymentSchema,
    getPaymentByIdSchema,
    getPolicyPaymentsSchema,
} from "../validators/payment.validator.js";

import { requireCompletedProfile } from "../middlewares/profile.middleware.js";

const router = Router();

router.use(verifyJWT);
router.use(requireCompletedProfile);

router.post(
    "/customer-pay",
    authorizeRoles(Role.CUSTOMER),
    validate(customerPaySchema),
    paymentController.customerPay
);

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



router.delete(
    "/:paymentId",
    authorizeRoles(Role.ADMIN),
    validate(deletePaymentSchema, "params"),
    paymentController.deletePayment
);

export default router;