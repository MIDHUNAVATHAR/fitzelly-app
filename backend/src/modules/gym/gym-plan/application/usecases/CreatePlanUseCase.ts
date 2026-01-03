import { IGymPlanRepository } from "../../domain/repositories/IGymPlanRepository.js";
import { CreatePlanRequestDTO, PlanResponseDTO } from "../dtos/GymPlanDTO.js";
import { GymPlan } from "../../domain/entities/GymPlan.js";
import { GymPlanDTOMapper } from "../mappers/GymPlanDTOMapper.js";
import { AppError } from "../../../../../core/errors/AppError.js";
import { HttpStatus } from "../../../../../constants/statusCodes.constants.js";

export class CreatePlanUseCase {
    constructor(private gymPlanRepository: IGymPlanRepository) { }

    async execute(request: CreatePlanRequestDTO): Promise<PlanResponseDTO> {
        // Validate request
        if (request.type === 'day' && !request.durationInDays) {
            throw new AppError("Duration in days is required for day-based plans", HttpStatus.BAD_REQUEST);
        }

        const newPlan = new GymPlan(
            "", // ID handled by DB
            request.gymId,
            request.planName,
            request.type,
            request.monthlyFee,
            false, // isDelete
            new Date(),
            new Date(),
            request.durationInDays,
            request.description
        );

        const createdPlan = await this.gymPlanRepository.create(newPlan);
        return GymPlanDTOMapper.toResponseDTO(createdPlan);
    }
}
