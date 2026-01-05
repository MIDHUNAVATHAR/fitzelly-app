import { SuperAdmin } from "../entities/SuperAdmin.js";

export interface ISuperAdminRepository {
    create(admin: SuperAdmin): Promise<SuperAdmin>;
    findByEmail(email: string): Promise<SuperAdmin | null>;
    findById(id: string): Promise<SuperAdmin | null>;
    update(admin: SuperAdmin): Promise<SuperAdmin>;
}
