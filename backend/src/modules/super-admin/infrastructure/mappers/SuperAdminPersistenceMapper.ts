import { SuperAdmin } from "../../domain/entities/SuperAdmin.js";
import { ISuperAdminDocument } from "../database/mongoose/SuperAdminSchema.js";
import mongoose from "mongoose";

export class SuperAdminPersistenceMapper {
    static toDomain(doc: ISuperAdminDocument): SuperAdmin {
        return new SuperAdmin(
            doc._id.toString(),
            doc.email,
            doc.password,
            doc.fullName,
            doc.createdAt,
            doc.updatedAt
        );
    }

    static toPersistence(entity: SuperAdmin): Partial<ISuperAdminDocument> {
        return {
            ...(entity.id && mongoose.Types.ObjectId.isValid(entity.id) ? { _id: new mongoose.Types.ObjectId(entity.id) as any } : {}),
            email: entity.email,
            ...(entity.password ? { password: entity.password } : {}),
            fullName: entity.fullName,
        };
    }
}
