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

            doc.isEmailVerified,
            doc.isDelete,
            doc.createdAt,
            doc.updatedAt
        );
    }

    static toPersistence(entity: GymTrainer): Partial<IGymTrainerDocument> {
        return {
            _id: new mongoose.Types.ObjectId(entity.id) as any,
            gymId: new mongoose.Types.ObjectId(entity.gymId),
            fullName: entity.fullName,
            email: entity.email,
            phone: entity.phone,
            specialization: entity.specialization,
            monthlySalary: entity.monthlySalary,

            isEmailVerified: entity.isEmailVerified,
            isDelete: entity.isDelete,
        };
    }
}
