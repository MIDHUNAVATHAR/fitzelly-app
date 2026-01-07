import { Router } from "express";
import { GymProfileController } from "../controllers/GymProfileController.js";
import { protect } from "../../../../../shared/middlewares/auth.middleware.js";
import { validateRequest } from "../../../../../shared/middlewares/validateRequest.js";
import { updateProfileSchema } from "../schemas/profile.schemas.js";

const router = Router();


// Get Profile
router.get('/profile', protect(['gym']), GymProfileController.getProfile);

// Update Profile
router.put('/profile', protect(['gym']), validateRequest(updateProfileSchema), GymProfileController.updateProfile);


export const gymProfileRouter = router;
