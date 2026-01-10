import { Router } from "express";
import { ClientProfileController } from "../controllers/ClientProfileController.js";
import { protect } from "../../../../../shared/middlewares/auth.middleware.js";

const router = Router();

router.use(protect(['client']));

router.get("/profile", ClientProfileController.getProfile);
router.put("/profile", ClientProfileController.updateProfile);

export const clientProfileRouter = router;
