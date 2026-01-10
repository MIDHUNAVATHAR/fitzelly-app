import { Router } from "express";
import { TrainerProfileController } from "../controllers/TrainerProfileController.js";
import { protect } from "../../../../../shared/middlewares/auth.middleware.js";
import { upload } from "../../../../../shared/middlewares/upload.middleware.js";

const router = Router();

router.use(protect(['trainer']));

router.get("/profile", TrainerProfileController.getProfile);
router.put("/profile", upload.single('profileImage'), TrainerProfileController.updateProfile);

export const trainerProfileRouter = router;
