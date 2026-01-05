import { Router } from "express";
import { GymListingController } from "../controllers/GymListingController.js";
import { authenticate } from "../../../../gym/authentication/infrastructure/http/middlewares/auth.middleware.js";

const gymListingRouter = Router();

// Protect with authenticate middleware. It checks for super-admin role if configured or just valid token.
// The existing auth middleware checks for user based on role in token. 
// Super Admin token has role 'super-admin'. Middleware should handle fetching SuperAdmin user.
// I updated auth.middleware previously to support 'super-admin'.

gymListingRouter.get('/', authenticate, GymListingController.getGyms);

export { gymListingRouter };
