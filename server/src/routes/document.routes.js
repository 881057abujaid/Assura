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

const router = Router();

router.post(
    "/",
    verifyJWT,
    authorizeRoles("AGENT", "ADMIN"),
    upload.single("document"),
    validate(uploadDocumentSchema),
    documentController.uploadDocument
);

router.get(
    "/:documentId",
    verifyJWT,
    validate(getDocumentByIdSchema),
    documentController.getDocumentById
);

router.get(
    "/customers/:customerId",
    verifyJWT,
    documentController.getCustomerDocuments
);

router.get(
    "/claims/:claimId",
    verifyJWT,
    documentController.getClaimDocuments
);

router.delete(
    "/:documentId",
    verifyJWT,
    authorizeRoles("ADMIN"),
    validate(deleteDocumentSchema),
    documentController.deleteDocument
);

export default router;