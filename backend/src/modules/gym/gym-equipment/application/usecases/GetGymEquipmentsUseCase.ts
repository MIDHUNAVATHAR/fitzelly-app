import { IGymEquipmentRepository } from "../../domain/repositories/IGymEquipmentRepository.js";
import { GymEquipment } from "../../domain/entities/GymEquipment.js";

export class GetGymEquipmentsUseCase {
    constructor(private gymEquipmentRepository: IGymEquipmentRepository) { }

    async execute(gymId: string, page: number, limit: number, search?: string): Promise<{ items: GymEquipment[], total: number }> {
        return this.gymEquipmentRepository.findEquipments(gymId, page, limit, search);
    }
}
