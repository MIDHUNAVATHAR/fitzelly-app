import type { IWorkoutPlanRepository } from "../../domain/repositories/IWorkoutPlanRepository.js";
import type { IGymClientRepository } from "../../../../gym/gym-client/domain/repositories/IGymClientRepository.js";
import type { WorkoutPlanResponseDTO } from "../dtos/WorkoutPlanDTO.js";
import { WorkoutPlanDTOMapper } from "../mappers/WorkoutPlanDTOMapper.js";
import { AppError } from "../../../../../core/errors/AppError.js";
import { HttpStatus } from "../../../../../constants/statusCodes.constants.js";

export class GetWorkoutPlanByClientIdUseCase {
    constructor(
        private workoutPlanRepository: IWorkoutPlanRepository,
        private clientRepository: IGymClientRepository
    ) { }

    async execute(clientId: string, trainerId: string): Promise<WorkoutPlanResponseDTO | null> {
        const client = await this.clientRepository.findById(clientId);

        if (!client) {
            throw new AppError("Client not found", HttpStatus.NOT_FOUND);
        }

        if (client.assignedTrainer !== trainerId) {
            throw new AppError("Client is not assigned to this trainer", HttpStatus.FORBIDDEN);
        }

        const plan = await this.workoutPlanRepository.findByClientId(clientId);

        if (!plan) {
            return null;
        }

        return WorkoutPlanDTOMapper.toResponseDTO(plan, client.fullName);
    }
}
