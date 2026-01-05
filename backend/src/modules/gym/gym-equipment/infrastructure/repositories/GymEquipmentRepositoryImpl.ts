import { IGymEquipmentRepository } from "../../domain/repositories/IGymEquipmentRepository.js";
import { GymEquipment } from "../../domain/entities/GymEquipment.js";
import { GymEquipmentModel } from "../database/mongoose/GymEquipmentSchema.js";
import { GymEquipmentPersistenceMapper } from "../mappers/GymEquipmentPersistenceMapper.js";
import mongoose from "mongoose";

export class GymEquipmentRepositoryImpl implements IGymEquipmentRepository {
    async create(equipment: GymEquipment): Promise<GymEquipment> {
        const persistence = {
            ...GymEquipmentPersistenceMapper.toPersistence(equipment),
            gymId: new mongoose.Types.ObjectId(equipment.gymId)
        };
        const doc = await GymEquipmentModel.create(persistence);
        return GymEquipmentPersistenceMapper.toDomain(doc);
    }

    async findById(id: string): Promise<GymEquipment | null> {
        const doc = await GymEquipmentModel.findById(id);
        if (!doc) return null;
        return GymEquipmentPersistenceMapper.toDomain(doc);
    }

    async update(equipment: GymEquipment): Promise<GymEquipment> {
        const persistence = GymEquipmentPersistenceMapper.toPersistence(equipment);
        const doc = await GymEquipmentModel.findByIdAndUpdate(equipment.id, persistence, { new: true });
        if (!doc) throw new Error("Equipment not found");
        return GymEquipmentPersistenceMapper.toDomain(doc);
    }

    async findEquipments(gymId: string, page: number, limit: number, search?: string): Promise<{ items: GymEquipment[]; total: number; }> {
        const query: any = {
            gymId: new mongoose.Types.ObjectId(gymId),
            isDeleted: false
        };

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        const skip = (page - 1) * limit;

        const [items, total] = await Promise.all([
            GymEquipmentModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
            GymEquipmentModel.countDocuments(query)
        ]);

        return {
            items: items.map(doc => GymEquipmentPersistenceMapper.toDomain(doc)),
            total
        };
    }
}
