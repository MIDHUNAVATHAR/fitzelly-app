import { Router } from "express";
import { WorkoutPlanController } from "../controllers/WorkoutPlanController.js";
import { CreateWorkoutPlanUseCase } from "../../application/usecases/CreateWorkoutPlanUseCase.js";
import { UpdateWorkoutPlanUseCase } from "../../application/usecases/UpdateWorkoutPlanUseCase.js";
import { DeleteWorkoutPlanUseCase } from "../../application/usecases/DeleteWorkoutPlanUseCase.js";
import { GetWorkoutPlanByClientIdUseCase } from "../../application/usecases/GetWorkoutPlanByClientIdUseCase.js";
import { WorkoutPlanRepositoryImpl } from "../../infrastructure/repositories/WorkoutPlanRepositoryImpl.js";
import { GymClientRepositoryImpl } from "../../../../gym/gym-client/infrastructure/repositories/GymClientRepositoryImpl.js";
import { protect } from "../../../../../shared/middlewares/auth.middleware.js";
import { ROLES } from "../../../../../constants/roles.constants.js";

const router = Router();

// Initialize repositories
const workoutPlanRepository = new WorkoutPlanRepositoryImpl();
const clientRepository = new GymClientRepositoryImpl();

// Initialize use cases
const createWorkoutPlanUseCase = new CreateWorkoutPlanUseCase(workoutPlanRepository, clientRepository);
const updateWorkoutPlanUseCase = new UpdateWorkoutPlanUseCase(workoutPlanRepository);
const deleteWorkoutPlanUseCase = new DeleteWorkoutPlanUseCase(workoutPlanRepository);
const getWorkoutPlanByClientIdUseCase = new GetWorkoutPlanByClientIdUseCase(workoutPlanRepository, clientRepository);

// Initialize controller
const workoutPlanController = new WorkoutPlanController(
    createWorkoutPlanUseCase,
    updateWorkoutPlanUseCase,
    deleteWorkoutPlanUseCase,
    getWorkoutPlanByClientIdUseCase
);

// Routes
router.post('/plans', protect([ROLES.TRAINER]), workoutPlanController.createWorkoutPlan);
router.put('/plans/:id', protect([ROLES.TRAINER]), workoutPlanController.updateWorkoutPlan);
router.delete('/plans/:id', protect([ROLES.TRAINER]), workoutPlanController.deleteWorkoutPlan);
router.get('/plans/client/:clientId', protect([ROLES.TRAINER]), workoutPlanController.getWorkoutPlanByClientId);

export default router;
