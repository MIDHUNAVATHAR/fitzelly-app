import { GymClient } from "../../domain/entities/GymClient.js";
import { IGymClientDocument } from "../database/mongoose/GymClientSchema.js";
import mongoose from "mongoose";

export class GymClientPersistenceMapper {
    static toDomain(doc: IGymClientDocument): GymClient {
        return new GymClient(
            doc._id.toString(),
            doc.gymId.toString(),
            doc.fullName,
            doc.email,
            doc.phone,
            doc.status,
            doc.isEmailVerified,
            doc.isBlocked,
            doc.isDelete,
            doc.createdAt,
            doc.updatedAt,
            doc.password,
            doc.assignedTrainer ? doc.assignedTrainer.toString() : undefined,
            doc.emergencyContactNumber,
            doc.dateOfBirth
        );
    }

    static toPersistence(entity: GymClient): Partial<IGymClientDocument> {
        return {
            _id: entity.id ? new mongoose.Types.ObjectId(entity.id) as any : undefined,
            gymId: new mongoose.Types.ObjectId(entity.gymId),
            fullName: entity.fullName,
            email: entity.email,
            phone: entity.phone,
            password: entity.password as string,
            status: entity.status,
            isEmailVerified: entity.isEmailVerified,
            isBlocked: entity.isBlocked,
            isDelete: entity.isDelete,
            assignedTrainer: entity.assignedTrainer ? new mongoose.Types.ObjectId(entity.assignedTrainer) : undefined,
            emergencyContactNumber: entity.emergencyContactNumber,
            dateOfBirth: entity.dateOfBirth
        };
    }
}
