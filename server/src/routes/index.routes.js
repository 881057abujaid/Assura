import { Router } from "express";

import healthRoutes from "./health.routes.js";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import policyTypeRoutes from "./policy-type.routes.js";
import customerRoutes from "./customer.routes.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/policy-types", policyTypeRoutes);
router.use("/customers", customerRoutes);

export default router;