import type { IWorkoutPlanRepository } from "../../../../trainer/workout-plan/domain/repositories/IWorkoutPlanRepository.js";
import type { IGymClientRepository } from "../../../../gym/gym-client/domain/repositories/IGymClientRepository.js";
import type { WorkoutPlanResponseDTO } from "../../../../trainer/workout-plan/application/dtos/WorkoutPlanDTO.js";
import { WorkoutPlanDTOMapper } from "../../../../trainer/workout-plan/application/mappers/WorkoutPlanDTOMapper.js";
import { AppError } from "../../../../../core/errors/AppError.js";
import { HttpStatus } from "../../../../../constants/statusCodes.constants.js";

export class GetMyWorkoutPlanUseCase {
    constructor(
        private workoutPlanRepository: IWorkoutPlanRepository,
        private clientRepository: IGymClientRepository
    ) { }

    async execute(clientId: string): Promise<WorkoutPlanResponseDTO | null> {
        const client = await this.clientRepository.findById(clientId);

        if (!client) {
            throw new AppError("Client not found", HttpStatus.NOT_FOUND);
        }

        const plan = await this.workoutPlanRepository.findByClientId(clientId);

        if (!plan) {
            return null;
        }

        return WorkoutPlanDTOMapper.toResponseDTO(plan, client.fullName);
    }
}
