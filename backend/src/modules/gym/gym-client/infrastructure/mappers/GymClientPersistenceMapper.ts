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
            doc.isDelete,
            doc.createdAt,
            doc.updatedAt
        );
    }

    static toPersistence(entity: GymClient): Partial<IGymClientDocument> {
        return {
            _id: new mongoose.Types.ObjectId(entity.id) as any,
            gymId: new mongoose.Types.ObjectId(entity.gymId),
            fullName: entity.fullName,
            email: entity.email,
            phone: entity.phone,
            status: entity.status,
            isEmailVerified: entity.isEmailVerified,
            isDelete: entity.isDelete,
        };
    }
}
