import { Router } from "express";
import { policyController } from "../controllers/policy.controller.js";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import {
    createPolicySchema,
    updatePolicySchema
} from "../validators/policy.validator.js";
import { Role } from "@prisma/client";

const router = Router();

router.use(verifyJWT);

router.post(
    "/",
    authorizeRoles(Role.AGENT, Role.ADMIN),
    validate(createPolicySchema),
    policyController.createPolicy
);

router.get(
    "/",
    authorizeRoles(Role.AGENT, Role.ADMIN),
    policyController.getAllPolicies
);

router.get(
    "/:policyId",
    authorizeRoles(Role.AGENT, Role.ADMIN),
    policyController.getPolicyById
);

router.patch(
    "/:policyId",
    authorizeRoles(Role.AGENT, Role.ADMIN),
    validate(updatePolicySchema),
    policyController.updatePolicy
);

router.delete(
    "/:policyId",
    authorizeRoles(Role.ADMIN),
    policyController.deletePolicy
);

export default router;