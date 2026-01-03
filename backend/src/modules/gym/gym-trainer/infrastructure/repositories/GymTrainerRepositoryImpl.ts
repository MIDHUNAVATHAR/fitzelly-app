import { IGymTrainerRepository } from "../../domain/repositories/IGymTrainerRepository.js";
import { GymTrainer } from "../../domain/entities/GymTrainer.js";
import { GymTrainerModel, IGymTrainerDocument } from "../database/mongoose/GymTrainerSchema.js";
import { GymTrainerPersistenceMapper } from "../mappers/GymTrainerPersistenceMapper.js";
import mongoose from "mongoose";

export class GymTrainerRepositoryImpl implements IGymTrainerRepository {
    async create(trainer: GymTrainer): Promise<GymTrainer> {
        const persistenceData = {
            gymId: new mongoose.Types.ObjectId(trainer.gymId),
            fullName: trainer.fullName,
            email: trainer.email,
            phone: trainer.phone,
            specialization: trainer.specialization,
            monthlySalary: trainer.monthlySalary,
            status: trainer.status,
            isDelete: trainer.isDelete
        };

        const doc = await GymTrainerModel.create(persistenceData);
        return GymTrainerPersistenceMapper.toDomain(doc);
    }

    async findById(id: string): Promise<GymTrainer | null> {
        const doc = await GymTrainerModel.findById(id);
        if (!doc) return null;
        return GymTrainerPersistenceMapper.toDomain(doc);
    }

    async findByGymId(gymId: string, options?: { search?: string, skip?: number, limit?: number }): Promise<{ trainers: GymTrainer[], total: number }> {
        const query: any = { gymId: gymId, isDelete: false };
        if (options?.search) {
            query.fullName = { $regex: options.search, $options: 'i' };
        }

        const limit = options?.limit || 10;
        const skip = options?.skip || 0;

        const total = await GymTrainerModel.countDocuments(query);
        const docs = await GymTrainerModel.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });

        return {
            trainers: docs.map(doc => GymTrainerPersistenceMapper.toDomain(doc)),
            total
        };
    }

    async update(trainer: GymTrainer): Promise<GymTrainer> {
        const updatePayload: any = {
            fullName: trainer.fullName,
            email: trainer.email,
            phone: trainer.phone,
            specialization: trainer.specialization,
            monthlySalary: trainer.monthlySalary,
            status: trainer.status,
            isDelete: trainer.isDelete,
            updatedAt: new Date()
        };

        const updatedDoc = await GymTrainerModel.findByIdAndUpdate(
            trainer.id,
            updatePayload,
            { new: true }
        );

        if (!updatedDoc) throw new Error("GymTrainer not found for update");
        return GymTrainerPersistenceMapper.toDomain(updatedDoc);
    }
}
