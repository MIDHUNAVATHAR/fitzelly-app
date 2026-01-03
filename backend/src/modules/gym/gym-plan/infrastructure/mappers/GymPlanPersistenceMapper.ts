import { GymPlan } from "../../domain/entities/GymPlan.js";
import { IGymPlanDocument } from "../database/mongoose/GymPlanSchema.js";
import mongoose from "mongoose";

export class GymPlanPersistenceMapper {
    static toDomain(doc: IGymPlanDocument): GymPlan {
        return new GymPlan(
            doc._id.toString(),
            doc.gymId.toString(),
            doc.planName,
            doc.type,
            doc.monthlyFee,
            doc.isDelete,
            doc.createdAt,
            doc.updatedAt,
            doc.durationInDays,
            doc.description
        );
    }

    static toPersistence(entity: GymPlan): Partial<IGymPlanDocument> {
        return {
            _id: new mongoose.Types.ObjectId(entity.id) as any,
            gymId: new mongoose.Types.ObjectId(entity.gymId),
            planName: entity.planName,
            type: entity.type,
            monthlyFee: entity.monthlyFee,
            ...(entity.durationInDays !== undefined ? { durationInDays: entity.durationInDays } : {}),
            ...(entity.description !== undefined ? { description: entity.description } : {}),
            isDelete: entity.isDelete,
        };
    }
}
