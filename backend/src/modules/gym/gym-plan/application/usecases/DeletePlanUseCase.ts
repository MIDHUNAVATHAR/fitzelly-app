import { IGymPlanRepository } from "../../domain/repositories/IGymPlanRepository.js";
import { AppError } from "../../../../../core/errors/AppError.js";
import { HttpStatus } from "../../../../../constants/statusCodes.constants.js";

export class DeletePlanUseCase {
    constructor(private gymPlanRepository: IGymPlanRepository) { }

    async execute(planId: string, gymId: string): Promise<void> {
        const plan = await this.gymPlanRepository.findById(planId);

        if (!plan) {
            throw new AppError("Plan not found", HttpStatus.NOT_FOUND);
        }

        if (plan.gymId !== gymId) {
            throw new AppError("Unauthorized access to plan", HttpStatus.FORBIDDEN);
        }

        const deletedPlanEntity = plan.markAsDeleted();
        await this.gymPlanRepository.update(deletedPlanEntity);
    }
}
