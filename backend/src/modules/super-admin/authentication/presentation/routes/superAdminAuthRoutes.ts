import { Router } from "express";
import { SuperAdminAuthController } from "../controllers/SuperAdminAuthController.js";
import { authenticate } from "../../../../gym/authentication/infrastructure/http/middlewares/auth.middleware.js";

const superAdminAuthRoutes = Router();

superAdminAuthRoutes.post('/forgot-password/initiate', SuperAdminAuthController.initiateReset);
superAdminAuthRoutes.post('/forgot-password/complete', SuperAdminAuthController.completeReset);
superAdminAuthRoutes.post('/login', SuperAdminAuthController.login);
superAdminAuthRoutes.get('/auth/me', authenticate, SuperAdminAuthController.verifyToken);

export { superAdminAuthRoutes };
