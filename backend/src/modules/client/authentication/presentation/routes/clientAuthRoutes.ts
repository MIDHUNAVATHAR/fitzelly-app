import { Router } from "express";
import { ClientAuthController } from "../controllers/ClientAuthController.js";

import { authenticate } from "../../../../gym/authentication/infrastructure/http/middlewares/auth.middleware.js";

const clientAuthRoutes = Router();

// Route: POST /api/v1/client-auth/forgot-password/initiate
clientAuthRoutes.post('/forgot-password/initiate', ClientAuthController.initiateReset);

// Route: POST /api/v1/client-auth/forgot-password/complete
clientAuthRoutes.post('/forgot-password/complete', ClientAuthController.completeReset);
clientAuthRoutes.post("/login", ClientAuthController.login);

// Protected
clientAuthRoutes.get("/auth/me", authenticate, ClientAuthController.verifyToken);

export { clientAuthRoutes };
