import { Router } from "express";
import { GymTrainerController } from "../controllers/GymTrainerController.js";
import { authenticate } from "../../../authentication/infrastructure/http/middlewares/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.post("/trainers", GymTrainerController.createTrainer);
router.get("/trainers", GymTrainerController.getTrainers);
router.put("/trainers/:id", GymTrainerController.updateTrainer);
router.delete("/trainers/:id", GymTrainerController.deleteTrainer);

export const gymTrainerRouter = router;
