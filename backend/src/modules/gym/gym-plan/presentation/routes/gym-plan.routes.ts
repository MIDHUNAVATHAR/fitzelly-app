import { Router } from "express";
import { GymPlanController } from "../controllers/GymPlanController.js";
import { protect } from "../../../../../shared/middlewares/auth.middleware.js";

const router = Router();

router.use(protect(['gym'])); // All plan routes are protected

router.post("/plans", GymPlanController.createPlan);
router.get("/plans", GymPlanController.getPlans);
router.put("/plans/:id", GymPlanController.updatePlan);
router.delete("/plans/:id", GymPlanController.deletePlan);

export const gymPlanRouter = router;
