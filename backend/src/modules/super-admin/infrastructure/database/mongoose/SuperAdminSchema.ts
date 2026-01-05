import mongoose, { Schema, Document } from "mongoose";

export interface ISuperAdminDocument extends Document {
    email: string;
    password?: string;
    fullName: string;
    createdAt: Date;
    updatedAt: Date;
}

const SuperAdminSchema = new Schema<ISuperAdminDocument>({
    email: { type: String, required: true, unique: true },
    password: { type: String },
    fullName: { type: String, default: 'Super Admin' }
}, { timestamps: true, collection: 'superadmin' });

export const SuperAdminModel = mongoose.model<ISuperAdminDocument>('SuperAdmin', SuperAdminSchema);
