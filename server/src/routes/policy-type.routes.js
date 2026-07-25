import { Router } from "express";
import { policyTypeController } from "../controllers/policy-type.controller.js";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { createPolicyTypeSchema, updatePolicyTypeSchema } from "../validators/policy-type.validator.js";
import { Role } from "@prisma/client";

const router = Router();

router.post(
    "/",
    verifyJWT,
    authorizeRoles(Role.ADMIN),
    validate(createPolicyTypeSchema),
    policyTypeController.createPolicyType
);

router.patch(
    "/:policyTypeId",
    verifyJWT,
    authorizeRoles(Role.ADMIN),
    validate(updatePolicyTypeSchema),
    policyTypeController.updatePolicyType
);

router.delete(
    "/:policyTypeId",
    verifyJWT,
    authorizeRoles(Role.ADMIN),
    policyTypeController.deletePolicyType
);

router.get(
    "/",
    verifyJWT,
    policyTypeController.getAllPolicyTypes
);

router.get(
    "/:policyTypeId",
    verifyJWT,
    policyTypeController.getPolicyTypeById
);

export default router;