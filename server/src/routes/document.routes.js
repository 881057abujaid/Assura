import { Router } from "express";
import { documentController } from "../controllers/document.controller.js";
import {
    uploadDocumentSchema,
    getDocumentByIdSchema,
    deleteDocumentSchema,
} from "../validators/document.validator.js";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import { Role } from "@prisma/client";

import { requireCompletedProfile } from "../middlewares/profile.middleware.js";

const router = Router();

router.use(verifyJWT);
router.use(requireCompletedProfile);

router.post(
    "/",
    authorizeRoles(Role.AGENT, Role.ADMIN, Role.CUSTOMER),
    upload.single("document"),
    validate(uploadDocumentSchema),
    documentController.uploadDocument
);

router.get(
    "/:documentId",
    validate(getDocumentByIdSchema, "params"),
    documentController.getDocumentById
);

router.get(
    "/customers/:customerId",
    authorizeRoles(Role.AGENT, Role.ADMIN, Role.CUSTOMER),
    documentController.getCustomerDocuments
);

router.get(
    "/claims/:claimId",
    authorizeRoles(Role.AGENT, Role.ADMIN, Role.CUSTOMER),
    documentController.getClaimDocuments
);

router.delete(
    "/:documentId",
    authorizeRoles(Role.ADMIN),
    validate(deleteDocumentSchema, "params"),
    documentController.deleteDocument
);

export default router;