import { GymMembership } from "../../domain/entities/GymMembership.js";
import { IGymMembershipDocument } from "../database/mongoose/GymMembershipSchema.js";
import mongoose from "mongoose";

export class GymMembershipPersistenceMapper {
    static toDomain(doc: IGymMembershipDocument): GymMembership {
        return new GymMembership(
            doc._id.toString(),
            doc.gymId.toString(),
            doc.clientId.toString(),
            doc.planId.toString(),
            doc.startDate,
            doc.expiredDate,
            doc.totalPurchasedDays,
            doc.remainingDays,
            doc.status,
            doc.isDelete,
            doc.createdAt,
            doc.updatedAt
        );
    }

    static toPersistence(entity: GymMembership): Partial<IGymMembershipDocument> {
        return {
            _id: new mongoose.Types.ObjectId(entity.id) as any,
            gymId: new mongoose.Types.ObjectId(entity.gymId),
            clientId: new mongoose.Types.ObjectId(entity.clientId),
            planId: new mongoose.Types.ObjectId(entity.planId),
            startDate: entity.startDate,
            expiredDate: entity.expiredDate,
            totalPurchasedDays: entity.totalPurchasedDays,
            remainingDays: entity.remainingDays,
            status: entity.status,
            isDelete: entity.isDelete
        };
    }
}
