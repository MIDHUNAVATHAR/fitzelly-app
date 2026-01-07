import { Router } from "express";
import { GymTrainerController } from "../controllers/GymTrainerController.js";
import { protect } from "../../../../../shared/middlewares/auth.middleware.js";

const router = Router();

router.use(protect(['gym']));

router.post("/trainers", GymTrainerController.createTrainer);
router.get("/trainers", GymTrainerController.getTrainers);
router.put("/trainers/:id", GymTrainerController.updateTrainer);
router.delete("/trainers/:id", GymTrainerController.deleteTrainer);
router.post("/trainers/:id/welcome", GymTrainerController.sendWelcomeEmail);

export const gymTrainerRouter = router;
