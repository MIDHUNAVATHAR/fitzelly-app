import { IGymEquipmentRepository } from "../../domain/repositories/IGymEquipmentRepository.js";
import { AppError } from "../../../../../core/errors/AppError.js";
import { HttpStatus } from "../../../../../constants/statusCodes.constants.js";

export class DeleteGymEquipmentUseCase {
    constructor(private gymEquipmentRepository: IGymEquipmentRepository) { }

    async execute(id: string, gymId: string): Promise<void> {
        const equipment = await this.gymEquipmentRepository.findById(id);
        if (!equipment) {
            throw new AppError("Equipment not found", HttpStatus.NOT_FOUND);
        }

        if (equipment.gymId !== gymId) {
            throw new AppError("Unauthorized", HttpStatus.FORBIDDEN);
        }

        const deleted = equipment.markAsDeleted();
        await this.gymEquipmentRepository.update(deleted);
    }
}
