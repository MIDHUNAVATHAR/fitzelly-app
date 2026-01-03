import { Router } from "express";
import { GymProfileController } from "../controllers/GymProfileController.js";
import { authenticate } from "../../../authentication/infrastructure/http/middlewares/auth.middleware.js";
import { validateRequest } from "../../../../../shared/middlewares/validateRequest.js";
import { updateProfileSchema } from "../schemas/profile.schemas.js";

const router = Router();


// Get Profile
router.get('/profile', authenticate, GymProfileController.getProfile);

// Update Profile
router.put('/profile', authenticate, validateRequest(updateProfileSchema), GymProfileController.updateProfile);


export const gymProfileRouter = router;
