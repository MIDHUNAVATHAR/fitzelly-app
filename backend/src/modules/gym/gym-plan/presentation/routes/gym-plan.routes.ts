import { Router } from "express";
import { GymPlanController } from "../controllers/GymPlanController.js";
import { authenticate } from "../../../authentication/infrastructure/http/middlewares/auth.middleware.js";

const router = Router();

router.use(authenticate); // All plan routes are protected

router.post("/plans", GymPlanController.createPlan);
router.get("/plans", GymPlanController.getPlans);
router.put("/plans/:id", GymPlanController.updatePlan);
router.delete("/plans/:id", GymPlanController.deletePlan);

export const gymPlanRouter = router;
