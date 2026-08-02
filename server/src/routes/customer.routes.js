import { Router } from "express";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import { customerController } from "../controllers/customer.controller.js";
import validate from "../middlewares/validate.middleware.js";
import authorizeCustomerOwnership from "../middlewares/ownership.middleware.js";
import {
    createCustomerSchema,
    updateCustomerSchema,
} from "../validators/customer.validator.js";

const router = Router();

router.use(verifyJWT);

router.patch(
    "/profile",
    authorizeRoles("CUSTOMER"),
    customerController.completeProfile
);

router.get(
    "/me",
    authorizeRoles("CUSTOMER"),
    customerController.getMyProfile
);

router.post(
    "/",
    validate(createCustomerSchema),
    authorizeRoles("ADMIN", "AGENT"),
    customerController.createCustomer
);

router.get(
    "/",
    authorizeRoles("ADMIN", "AGENT"),
    customerController.getAllCustomers
);

router.get(
    "/:customerId",
    authorizeRoles("ADMIN", "AGENT", "CUSTOMER"),
    authorizeCustomerOwnership,
    customerController.getCustomerById
);

router.patch(
    "/:customerId",
    validate(updateCustomerSchema),
    authorizeRoles("ADMIN", "AGENT", "CUSTOMER"),
    authorizeCustomerOwnership,
    customerController.updateCustomer
);

router.delete(
    "/:customerId",
    authorizeRoles("ADMIN"),
    customerController.deleteCustomer
);

export default router;