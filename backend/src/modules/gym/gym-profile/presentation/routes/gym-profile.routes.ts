import { Router } from "express";
import { GymProfileController } from "../controllers/GymProfileController.js";
import { protect } from "../../../../../shared/middlewares/auth.middleware.js";
import { validateRequest } from "../../../../../shared/middlewares/validateRequest.js";
import { updateProfileSchema } from "../schemas/profile.schemas.js";

import { upload } from "../../../../../shared/middlewares/upload.middleware.js";

const router = Router();


// Get Profile
router.get('/profile', protect(['gym']), GymProfileController.getProfile);

// Update Profile
router.put('/profile',
    protect(['gym']),
    upload.single('profileImage'),
    (req, res, next) => {
        if (req.body.address && typeof req.body.address === 'string') {
            try {
                req.body.address = JSON.parse(req.body.address);
            } catch (e) {
                // Ignore parse error, let validator handle it
            }
        }
        next();
    },
    validateRequest(updateProfileSchema),
    GymProfileController.updateProfile
);


export const gymProfileRouter = router;
