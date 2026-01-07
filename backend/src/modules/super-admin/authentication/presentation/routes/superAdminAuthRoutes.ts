import { Router } from "express";
import { SuperAdminAuthController } from "../controllers/SuperAdminAuthController.js";
import { protect } from "../../../../../shared/middlewares/auth.middleware.js";

const superAdminAuthRoutes = Router();

superAdminAuthRoutes.post('/forgot-password/initiate', SuperAdminAuthController.initiateReset);
superAdminAuthRoutes.post('/forgot-password/complete', SuperAdminAuthController.completeReset);
superAdminAuthRoutes.post('/login', SuperAdminAuthController.login);
superAdminAuthRoutes.get('/auth/me', protect(['super-admin']), SuperAdminAuthController.verifyToken);

export { superAdminAuthRoutes };
