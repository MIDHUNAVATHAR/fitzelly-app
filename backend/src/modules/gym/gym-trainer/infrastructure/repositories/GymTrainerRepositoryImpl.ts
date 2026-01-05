import { IGymTrainerRepository } from "../../domain/repositories/IGymTrainerRepository.js";
import { GymTrainer } from "../../domain/entities/GymTrainer.js";
import { GymTrainerModel, IGymTrainerDocument } from "../database/mongoose/GymTrainerSchema.js";
import { GymTrainerPersistenceMapper } from "../mappers/GymTrainerPersistenceMapper.js";
import mongoose from "mongoose";

export class GymTrainerRepositoryImpl implements IGymTrainerRepository {
    async create(trainer: GymTrainer): Promise<GymTrainer> {
        // We use the mapper to get the persistence object
        // Note: The mapper includes _id, which Mongoose accepts if you want to set it, or omit if you want Mongoose to generate.
        // Assuming your Domain Entity creation logic generates an ID, passing it is fine.
        const persistenceData = GymTrainerPersistenceMapper.toPersistence(trainer);
        // Remove _id if we want Mongo to generate it, but our Entity usually has one.
        // If trainer.id is 'placeholder' or empty on creation, we might have issues. 
        // Typically, we let Mongo generate ID, then map back to domain.
        // But let's check current 'create' method: it takes 'trainer: GymTrainer'.
        // If the Use Case creates a GymTrainer with a generated ID (uuid?), then saving it with that ID is fine.
        // If Use Case passes a GymTrainer with empty ID, then we have a problem.
        // Let's stick to adding fields to the existing object construction for safety, OR use mapper if we trust it.
        // I will use mapper but omit _id to be safe? 
        // Actually, previous implementation constructed object manually.
        // Let's manually add fields for now to match style, or use mapper.
        // I'll use mapper cause it's better.
        const persistenceObj: any = GymTrainerPersistenceMapper.toPersistence(trainer);
        delete persistenceObj._id; // Let Mongo generate ID ideally, or if provided, keep it. 
        // In this project, IDs seem to be Mongo generated.

        const doc = await GymTrainerModel.create(persistenceObj);
        return GymTrainerPersistenceMapper.toDomain(doc);
    }

    async findById(id: string): Promise<GymTrainer | null> {
        const doc = await GymTrainerModel.findById(id);
        if (!doc) return null;
        return GymTrainerPersistenceMapper.toDomain(doc);
    }

    async findByEmail(email: string): Promise<GymTrainer | null> {
        const doc = await GymTrainerModel.findOne({ email });
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
        const updatePayload = GymTrainerPersistenceMapper.toPersistence(trainer);
        // Remove _id and immutable fields if necessary, but findByIdAndUpdate handles it.
        // Just need to ensure we don't accidentally unset fields.

        const updatedDoc = await GymTrainerModel.findByIdAndUpdate(
            trainer.id,
            updatePayload,
            { new: true }
        );

        if (!updatedDoc) throw new Error("GymTrainer not found for update");
        return GymTrainerPersistenceMapper.toDomain(updatedDoc);
    }
}
