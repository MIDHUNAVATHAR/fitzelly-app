import { GymTrainer } from "../../domain/entities/GymTrainer.js";
import { IGymTrainerDocument } from "../database/mongoose/GymTrainerSchema.js";
import mongoose from "mongoose";

export class GymTrainerPersistenceMapper {
    static toDomain(doc: IGymTrainerDocument): GymTrainer {
        return new GymTrainer(
            doc._id.toString(),
            doc.gymId.toString(),
            doc.fullName,
            doc.email,
            doc.phone,
            doc.specialization,
            doc.monthlySalary,
            doc.biography || '',
            doc.dateOfBirth,

            doc.password,

            doc.isEmailVerified || false,
            doc.isBlocked || false,
            doc.isDelete,
            doc.createdAt,
            doc.updatedAt,
            doc.profilePicture
        );
    }

    static toPersistence(entity: GymTrainer): Partial<IGymTrainerDocument> {
        return {
            ...(entity.id && mongoose.Types.ObjectId.isValid(entity.id) ? { _id: new mongoose.Types.ObjectId(entity.id) as any } : {}),
            gymId: new mongoose.Types.ObjectId(entity.gymId),
            fullName: entity.fullName,
            email: entity.email,
            phone: entity.phone,
            ...(entity.password ? { password: entity.password } : {}),
            specialization: entity.specialization,
            monthlySalary: entity.monthlySalary,
            biography: entity.biography,
            ...(entity.dateOfBirth ? { dateOfBirth: entity.dateOfBirth } : {}),

            isEmailVerified: entity.isEmailVerified,
            isBlocked: entity.isBlocked,
            isDelete: entity.isDelete,
            profilePicture: entity.profilePicture
        };
    }
}
