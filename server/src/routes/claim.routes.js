import { Router } from "express";
import { Role } from "@prisma/client";
import { claimController } from "../controllers/claim.controller.js";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import {
    createClaimSchema,
    updateClaimSchema,
    reviewClaimSchema
} from "../validators/claim.validator.js";

import { requireCompletedProfile } from "../middlewares/profile.middleware.js";

const router = Router();

router.use(verifyJWT);
router.use(requireCompletedProfile);

router.post(
    "/",
    authorizeRoles(Role.ADMIN, Role.AGENT, Role.CUSTOMER),
    validate(createClaimSchema),
    claimController.createClaim
);

router.get(
    "/",
    authorizeRoles(Role.ADMIN, Role.AGENT, Role.CUSTOMER),
    claimController.getAllClaims
);

router.get(
    "/:claimId",
    authorizeRoles(Role.ADMIN, Role.AGENT, Role.CUSTOMER),
    claimController.getClaimById
);

router.patch(
    "/:claimId",
    authorizeRoles(Role.ADMIN, Role.AGENT),
    validate(updateClaimSchema),
    claimController.updateClaim
);

router.patch(
    "/:claimId/review",
    authorizeRoles(Role.ADMIN, Role.AGENT),
    validate(reviewClaimSchema),
    claimController.reviewClaim
);

router.delete(
    "/:claimId",
    authorizeRoles(Role.ADMIN),
    claimController.deleteClaim
);

export default router;