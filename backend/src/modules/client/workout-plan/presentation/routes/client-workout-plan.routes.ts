import { Router } from "express";
import { ClientWorkoutPlanController } from "../controllers/ClientWorkoutPlanController.js";
import { GetMyWorkoutPlanUseCase } from "../../application/usecases/GetMyWorkoutPlanUseCase.js";
import { WorkoutPlanRepositoryImpl } from "../../../../trainer/workout-plan/infrastructure/repositories/WorkoutPlanRepositoryImpl.js";
import { GymClientRepositoryImpl } from "../../../../gym/gym-client/infrastructure/repositories/GymClientRepositoryImpl.js";
import { protect } from "../../../../../shared/middlewares/auth.middleware.js";
import { ROLES } from "../../../../../constants/roles.constants.js";

const router = Router();

// Initialize repositories
const workoutPlanRepository = new WorkoutPlanRepositoryImpl();
const clientRepository = new GymClientRepositoryImpl();

// Initialize use cases
const getMyWorkoutPlanUseCase = new GetMyWorkoutPlanUseCase(workoutPlanRepository, clientRepository);

// Initialize controller
const clientWorkoutPlanController = new ClientWorkoutPlanController(getMyWorkoutPlanUseCase);

// Routes
router.get('/my-plan', protect([ROLES.CLIENT]), clientWorkoutPlanController.getMyPlan);

export default router;
