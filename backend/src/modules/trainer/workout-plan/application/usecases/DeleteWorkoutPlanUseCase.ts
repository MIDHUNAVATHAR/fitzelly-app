import type { IWorkoutPlanRepository } from "../../domain/repositories/IWorkoutPlanRepository.js";
import { AppError } from "../../../../../core/errors/AppError.js";
import { HttpStatus } from "../../../../../constants/statusCodes.constants.js";

export class DeleteWorkoutPlanUseCase {
    constructor(private workoutPlanRepository: IWorkoutPlanRepository) { }

    async execute(planId: string, trainerId: string): Promise<void> {
        const plan = await this.workoutPlanRepository.findById(planId);

        if (!plan) {
            throw new AppError("Workout plan not found", HttpStatus.NOT_FOUND);
        }

        if (plan.trainerId !== trainerId) {
            throw new AppError("Unauthorized access to workout plan", HttpStatus.FORBIDDEN);
        }

        await this.workoutPlanRepository.delete(planId);
    }
}
