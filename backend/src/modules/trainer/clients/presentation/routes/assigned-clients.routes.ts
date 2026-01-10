import { Router } from "express";
import { AssignedClientsController } from "../controllers/AssignedClientsController.js";
import { GetAssignedClientsUseCase } from "../../application/usecases/GetAssignedClientsUseCase.js";
import { GetAssignedClientDetailsUseCase } from "../../application/usecases/GetAssignedClientDetailsUseCase.js";
import { GymClientRepositoryImpl } from "../../../../gym/gym-client/infrastructure/repositories/GymClientRepositoryImpl.js";
import { WorkoutPlanRepositoryImpl } from "../../../workout-plan/infrastructure/repositories/WorkoutPlanRepositoryImpl.js";
import { protect } from "../../../../../shared/middlewares/auth.middleware.js";
import { ROLES } from "../../../../../constants/roles.constants.js";

const router = Router();

// Initialize repositories
const clientRepository = new GymClientRepositoryImpl();
const workoutPlanRepository = new WorkoutPlanRepositoryImpl();

// Initialize use case
const getAssignedClientsUseCase = new GetAssignedClientsUseCase(clientRepository);
const getAssignedClientDetailsUseCase = new GetAssignedClientDetailsUseCase(clientRepository);

// Initialize controller
const assignedClientsController = new AssignedClientsController(
    getAssignedClientsUseCase,
    getAssignedClientDetailsUseCase,
    workoutPlanRepository
);

// Routes
router.get('/clients', protect([ROLES.TRAINER]), assignedClientsController.getAssignedClients);
router.get('/clients/:id', protect([ROLES.TRAINER]), assignedClientsController.getClientDetails);

export default router;
