import { ISuperAdminRepository } from "../../domain/repositories/ISuperAdminRepository.js";
import { SuperAdmin } from "../../domain/entities/SuperAdmin.js";
import { SuperAdminModel } from "../database/mongoose/SuperAdminSchema.js";
import { SuperAdminPersistenceMapper } from "../mappers/SuperAdminPersistenceMapper.js";

export class SuperAdminRepositoryImpl implements ISuperAdminRepository {
    async create(admin: SuperAdmin): Promise<SuperAdmin> {
        const persistenceData = SuperAdminPersistenceMapper.toPersistence(admin);
        const doc = await SuperAdminModel.create(persistenceData);
        return SuperAdminPersistenceMapper.toDomain(doc);
    }

    async findByEmail(email: string): Promise<SuperAdmin | null> {
        const doc = await SuperAdminModel.findOne({ email });
        if (!doc) return null;
        return SuperAdminPersistenceMapper.toDomain(doc);
    }

    async findById(id: string): Promise<SuperAdmin | null> {
        const doc = await SuperAdminModel.findById(id);
        if (!doc) return null;
        return SuperAdminPersistenceMapper.toDomain(doc);
    }

    async update(admin: SuperAdmin): Promise<SuperAdmin> {
        const updatePayload = SuperAdminPersistenceMapper.toPersistence(admin);
        const updatedDoc = await SuperAdminModel.findByIdAndUpdate(
            admin.id,
            updatePayload,
            { new: true }
        );
        if (!updatedDoc) throw new Error("Super Admin not found for update");
        return SuperAdminPersistenceMapper.toDomain(updatedDoc);
    }
}
