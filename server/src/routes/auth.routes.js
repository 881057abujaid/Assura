import { Router } from "express";

import { authController } from "../controllers/auth.controller.js";
import validate from "../middlewares/validate.middleware.js";
import { loginSchema, registerSchema } from "../validators/auth.validator.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post(
    "/register",
    validate(registerSchema),
    authController.register
);

router.post(
    "/login",
    validate(loginSchema),
    authController.login
);

router.post(
    "/refresh-token",
    authController.refreshAccessToken
);

router.post(
    "/logout",
    verifyJWT,
    authController.logout
);

export default router;