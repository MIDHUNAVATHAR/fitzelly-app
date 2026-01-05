import { IGymEquipmentRepository } from "../../domain/repositories/IGymEquipmentRepository.js";
import { GymEquipment } from "../../domain/entities/GymEquipment.js";
import { AppError } from "../../../../../core/errors/AppError.js";
import { HttpStatus } from "../../../../../constants/statusCodes.constants.js";
import { UpdateGymEquipmentDTO } from "../dtos/GymEquipmentDTO.js";

export class UpdateGymEquipmentUseCase {
    constructor(private gymEquipmentRepository: IGymEquipmentRepository) { }

    async execute(id: string, gymId: string, dto: UpdateGymEquipmentDTO): Promise<GymEquipment> {
        const equipment = await this.gymEquipmentRepository.findById(id);
        if (!equipment) {
            throw new AppError("Equipment not found", HttpStatus.NOT_FOUND);
        }

        if (equipment.gymId !== gymId) {
            throw new AppError("Unauthorized", HttpStatus.FORBIDDEN);
        }

        const updated = equipment.update(dto);
        return this.gymEquipmentRepository.update(updated);
    }
}
