import { Router } from "express";
import { ClientProfileController } from "../controllers/ClientProfileController.js";
import { protect } from "../../../../../shared/middlewares/auth.middleware.js";
import { upload } from "../../../../../shared/middlewares/upload.middleware.js";
import { ROLES } from "../../../../../constants/roles.constants.js";

const router = Router();

// Routes
// Note: router.use(protect...) applies to all, but sometimes it's better to be explicit or if we already have it in app.ts (which we don't for sub-routers usually)
// However, the previous code had router.get('/', ...).

router.get('/profile', protect([ROLES.CLIENT]), ClientProfileController.getProfile);
router.put('/profile', protect([ROLES.CLIENT]), upload.single('profileImage'), ClientProfileController.updateProfile);
router.get('/trainer', protect([ROLES.CLIENT]), ClientProfileController.getAssignedTrainer);

export { router as clientProfileRouter };
