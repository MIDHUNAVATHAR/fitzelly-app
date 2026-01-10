import type { IWorkoutPlanRepository } from "../../domain/repositories/IWorkoutPlanRepository.js";
import type { UpdateWorkoutPlanRequestDTO, WorkoutPlanResponseDTO } from "../dtos/WorkoutPlanDTO.js";
import type { DayPlan } from "../../domain/entities/WorkoutPlan.js";
import { WorkoutPlanDTOMapper } from "../mappers/WorkoutPlanDTOMapper.js";
import { AppError } from "../../../../../core/errors/AppError.js";
import { HttpStatus } from "../../../../../constants/statusCodes.constants.js";

export class UpdateWorkoutPlanUseCase {
    constructor(private workoutPlanRepository: IWorkoutPlanRepository) { }

    async execute(request: UpdateWorkoutPlanRequestDTO): Promise<WorkoutPlanResponseDTO> {
        const plan = await this.workoutPlanRepository.findById(request.planId);

        if (!plan) {
            throw new AppError("Workout plan not found", HttpStatus.NOT_FOUND);
        }

        if (plan.trainerId !== request.trainerId) {
            throw new AppError("Unauthorized access to workout plan", HttpStatus.FORBIDDEN);
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

        const updatedPlan = plan.updatePlan(weeklyPlan);
        const result = await this.workoutPlanRepository.update(updatedPlan);
        return WorkoutPlanDTOMapper.toResponseDTO(result);
    }
}
