import { Router } from "express";
import { userController } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { updateProfileSchema, changePasswordSchema } from "../validators/user.validate.js";
import validate from "../middlewares/validate.middleware.js";

const router = Router();

router.get(
    "/me",
    verifyJWT,
    userController.getCurrentUser
);

router.patch(
    "/me",
    verifyJWT,
    validate(updateProfileSchema),
    userController.updateProfile
);

router.patch(
    "/change-password",
    verifyJWT,
    validate(changePasswordSchema),
    userController.changePassword
);

export default router;