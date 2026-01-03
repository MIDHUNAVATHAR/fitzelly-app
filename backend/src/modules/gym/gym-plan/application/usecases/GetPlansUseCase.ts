import { IGymPlanRepository } from "../../domain/repositories/IGymPlanRepository.js";
import { PlanResponseDTO } from "../dtos/GymPlanDTO.js";
import { GymPlanDTOMapper } from "../mappers/GymPlanDTOMapper.js";

export class GetPlansUseCase {
    constructor(private gymPlanRepository: IGymPlanRepository) { }

    async execute(gymId: string): Promise<PlanResponseDTO[]> {
        const plans = await this.gymPlanRepository.findByGymId(gymId);
        return plans.map(plan => GymPlanDTOMapper.toResponseDTO(plan));
    }
}
