import { Router } from "express";
import { TrainerAuthController } from "../controllers/TrainerAuthController.js";
import { authenticate } from "../../../../gym/authentication/infrastructure/http/middlewares/auth.middleware.js";

const trainerAuthRoutes = Router();

// Route: POST /api/v1/trainer-auth/forgot-password/initiate
trainerAuthRoutes.post('/forgot-password/initiate', TrainerAuthController.initiateReset);

// Route: POST /api/v1/trainer-auth/forgot-password/complete
trainerAuthRoutes.post('/forgot-password/complete', TrainerAuthController.completeReset);

// Route: POST /api/v1/trainer-auth/login
trainerAuthRoutes.post("/login", TrainerAuthController.login);

// Protected
trainerAuthRoutes.get("/auth/me", authenticate, TrainerAuthController.verifyToken);

export { trainerAuthRoutes };
