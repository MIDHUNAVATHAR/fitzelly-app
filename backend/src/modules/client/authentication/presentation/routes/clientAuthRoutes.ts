import { Router } from "express";
import { ClientAuthController } from "../controllers/ClientAuthController.js";

import { protect } from "../../../../../shared/middlewares/auth.middleware.js";
import { ROLES } from "../../../../../constants/roles.constants.js";

const clientAuthRoutes = Router();

// Route: POST /api/v1/client-auth/forgot-password/initiate
clientAuthRoutes.post('/forgot-password/initiate', ClientAuthController.initiateReset);

// Route: POST /api/v1/client-auth/forgot-password/complete
clientAuthRoutes.post('/forgot-password/complete', ClientAuthController.completeReset);
// Route: POST /api/v1/client-auth/logout
clientAuthRoutes.post("/logout", ClientAuthController.logout);
clientAuthRoutes.post("/login", ClientAuthController.login);

// Protected
clientAuthRoutes.get("/auth/me", protect([ROLES.CLIENT]), ClientAuthController.verifyToken);

export { clientAuthRoutes };
