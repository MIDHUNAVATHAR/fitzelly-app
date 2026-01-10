import { Router } from "express";
import { TrainerProfileController } from "../controllers/TrainerProfileController.js";
import { protect } from "../../../../../shared/middlewares/auth.middleware.js";

const router = Router();

router.use(protect(['trainer']));

router.get("/profile", TrainerProfileController.getProfile);
router.put("/profile", TrainerProfileController.updateProfile);

export const trainerProfileRouter = router;
