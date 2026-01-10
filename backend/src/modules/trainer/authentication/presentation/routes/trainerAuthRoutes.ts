import { Router } from "express";
import { TrainerAuthController } from "../controllers/TrainerAuthController.js";
import { protect } from "../../../../../shared/middlewares/auth.middleware.js";
import { ROLES } from "../../../../../constants/roles.constants.js";

const trainerAuthRoutes = Router();

// Route: POST /api/v1/trainer-auth/forgot-password/initiate
trainerAuthRoutes.post('/forgot-password/initiate', TrainerAuthController.initiateReset);

// Route: POST /api/v1/trainer-auth/forgot-password/complete
trainerAuthRoutes.post('/forgot-password/complete', TrainerAuthController.completeReset);

// Route: POST /api/v1/trainer-auth/logout
trainerAuthRoutes.post("/logout", TrainerAuthController.logout);

// Route: POST /api/v1/trainer-auth/login
trainerAuthRoutes.post("/login", TrainerAuthController.login);

// Protected
trainerAuthRoutes.get("/auth/me", protect([ROLES.TRAINER]), TrainerAuthController.verifyToken);

export { trainerAuthRoutes };
