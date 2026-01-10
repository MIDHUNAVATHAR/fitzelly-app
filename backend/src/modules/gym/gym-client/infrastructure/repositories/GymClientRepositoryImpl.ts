import { IGymClientRepository } from "../../domain/repositories/IGymClientRepository.js";
import { GymClient } from "../../domain/entities/GymClient.js";
import { GymClientModel } from "../database/mongoose/GymClientSchema.js";
import { GymClientPersistenceMapper } from "../mappers/GymClientPersistenceMapper.js";
import mongoose from "mongoose";

export class GymClientRepositoryImpl implements IGymClientRepository {
    async create(client: GymClient): Promise<GymClient> {
        const persistenceData = {
            gymId: new mongoose.Types.ObjectId(client.gymId),
            fullName: client.fullName,
            email: client.email,
            phone: client.phone,
            status: client.status,
            isEmailVerified: client.isEmailVerified,
            isBlocked: client.isBlocked,
            isDelete: client.isDelete
        };

        const doc = await GymClientModel.create(persistenceData);
        return GymClientPersistenceMapper.toDomain(doc);
    }

    async findById(id: string): Promise<GymClient | null> {
        const doc = await GymClientModel.findById(id);
        if (!doc) return null;
        return GymClientPersistenceMapper.toDomain(doc);
    }

    async findByEmail(email: string): Promise<GymClient | null> {
        const doc = await GymClientModel.findOne({ email, isDelete: false });
        if (!doc) return null;
        return GymClientPersistenceMapper.toDomain(doc);
    }

    async findByGymId(gymId: string, options?: { search?: string, skip?: number, limit?: number, status?: string }): Promise<{ clients: GymClient[], total: number }> {
        const query: any = { gymId: gymId, isDelete: false };
        if (options?.search) {
            query.fullName = { $regex: options.search, $options: 'i' };
        }
        if (options?.status) {
            query.status = options.status;
        }

        const limit = options?.limit || 10;
        const skip = options?.skip || 0;

        const total = await GymClientModel.countDocuments(query);
        const docs = await GymClientModel.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });

        return {
            clients: docs.map(doc => GymClientPersistenceMapper.toDomain(doc)),
            total
        };
    }

    async update(client: GymClient): Promise<GymClient> {
        const updatePayload: any = {
            fullName: client.fullName,
            email: client.email,
            phone: client.phone,
            password: client.password,
            status: client.status,
            isEmailVerified: client.isEmailVerified,
            isBlocked: client.isBlocked,
            isDelete: client.isDelete,
            updatedAt: new Date()
        };

        const updatedDoc = await GymClientModel.findByIdAndUpdate(
            client.id,
            updatePayload,
            { new: true }
        );

        if (!updatedDoc) throw new Error("GymClient not found for update");
        return GymClientPersistenceMapper.toDomain(updatedDoc);
    }
}
