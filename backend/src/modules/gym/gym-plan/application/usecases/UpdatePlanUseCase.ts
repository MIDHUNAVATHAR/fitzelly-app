import { IGymPlanRepository } from "../../domain/repositories/IGymPlanRepository.js";
import { UpdatePlanRequestDTO, PlanResponseDTO } from "../dtos/GymPlanDTO.js";
import { GymPlanDTOMapper } from "../mappers/GymPlanDTOMapper.js";
import { AppError } from "../../../../../core/errors/AppError.js";
import { HttpStatus } from "../../../../../constants/statusCodes.constants.js";

export class UpdatePlanUseCase {
    constructor(private gymPlanRepository: IGymPlanRepository) { }

    async execute(request: UpdatePlanRequestDTO): Promise<PlanResponseDTO> {
        const plan = await this.gymPlanRepository.findById(request.planId);

        if (!plan) {
            throw new AppError("Plan not found", HttpStatus.NOT_FOUND);
        }

        if (plan.gymId !== request.gymId) {
            throw new AppError("Unauthorized access to plan", HttpStatus.FORBIDDEN);
        }

        const updatedPlanEntity = plan.updateDetails({
            ...(request.planName !== undefined ? { planName: request.planName } : {}),
            ...(request.monthlyFee !== undefined ? { monthlyFee: request.monthlyFee } : {}),
            ...(request.durationInDays !== undefined ? { durationInDays: request.durationInDays } : {}),
            ...(request.description !== undefined ? { description: request.description } : {})
        });

        const updatedPlan = await this.gymPlanRepository.update(updatedPlanEntity);
        return GymPlanDTOMapper.toResponseDTO(updatedPlan);
    }
}
