import type { IWorkoutPlanRepository } from "../../domain/repositories/IWorkoutPlanRepository.js";
import type { IGymClientRepository } from "../../../../gym/gym-client/domain/repositories/IGymClientRepository.js";
import { WorkoutPlan, type DayPlan } from "../../domain/entities/WorkoutPlan.js";
import type { CreateWorkoutPlanRequestDTO, WorkoutPlanResponseDTO } from "../dtos/WorkoutPlanDTO.js";
import { WorkoutPlanDTOMapper } from "../mappers/WorkoutPlanDTOMapper.js";
import { AppError } from "../../../../../core/errors/AppError.js";
import { HttpStatus } from "../../../../../constants/statusCodes.constants.js";
import crypto from "crypto";

export class CreateWorkoutPlanUseCase {
    constructor(
        private workoutPlanRepository: IWorkoutPlanRepository,
        private clientRepository: IGymClientRepository
    ) { }

    async execute(request: CreateWorkoutPlanRequestDTO): Promise<WorkoutPlanResponseDTO> {
        // Check if client exists and is assigned to this trainer
        const client = await this.clientRepository.findById(request.clientId);
        if (!client) {
            throw new AppError("Client not found", HttpStatus.NOT_FOUND);
        }

        if (client.assignedTrainer !== request.trainerId) {
            throw new AppError("Client is not assigned to this trainer", HttpStatus.FORBIDDEN);
        }

        // Check if plan already exists for this client
        const existingPlan = await this.workoutPlanRepository.findByClientId(request.clientId);
        if (existingPlan) {
            throw new AppError("Workout plan already exists for this client", HttpStatus.CONFLICT);
        }

        const weeklyPlan: DayPlan[] = request.weeklyPlan.map(dayPlan => ({
            day: dayPlan.day,
            exercises: dayPlan.exercises.map(ex => ({
                name: ex.name,
                sets: ex.sets,
                reps: ex.reps,
                rest: ex.rest,
            })),
            isRestDay: dayPlan.isRestDay,
        }));

        const workoutPlan = new WorkoutPlan(
            crypto.randomUUID(),
            request.trainerId,
            request.clientId,
            weeklyPlan,
            new Date(),
            new Date()
        );

        const result = await this.workoutPlanRepository.create(workoutPlan);
        return WorkoutPlanDTOMapper.toResponseDTO(result, client.fullName);
    }
}
