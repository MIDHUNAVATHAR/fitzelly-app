import { GymEquipment } from "../entities/GymEquipment.js";

export interface IGymEquipmentRepository {
    create(equipment: GymEquipment): Promise<GymEquipment>;
    findById(id: string): Promise<GymEquipment | null>;
    update(equipment: GymEquipment): Promise<GymEquipment>;
    findEquipments(gymId: string, page: number, limit: number, search?: string): Promise<{ items: GymEquipment[], total: number }>;
}
