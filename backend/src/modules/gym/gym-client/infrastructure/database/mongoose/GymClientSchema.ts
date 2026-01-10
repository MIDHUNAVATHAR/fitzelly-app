import mongoose, { Schema, Document } from "mongoose";

export interface IGymClientDocument extends Document {
    gymId: mongoose.Types.ObjectId;
    fullName: string;
    email: string;
    phone: string;
    status: 'active' | 'inactive' | 'expired';
    isEmailVerified: boolean;
    isBlocked: boolean;
    isDelete: boolean;
    password?: string;
    createdAt: Date;
    updatedAt: Date;
    assignedTrainer?: mongoose.Types.ObjectId;
    emergencyContactNumber?: string;
    dateOfBirth?: Date;
}

const GymClientSchema = new Schema<IGymClientDocument>({
    gymId: { type: Schema.Types.ObjectId, ref: 'Gym', required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, default: null },
    phone: { type: String, required: true },
    status: { type: String, enum: ['active', 'inactive', 'expired'], default: 'inactive' },
    isEmailVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    isDelete: { type: Boolean, default: false },
    assignedTrainer: { type: Schema.Types.ObjectId, ref: 'GymTrainer', default: null },
    emergencyContactNumber: { type: String, default: '' },
    dateOfBirth: { type: Date, default: null }
}, { timestamps: true });

export const GymClientModel = mongoose.models.GymClient || mongoose.model<IGymClientDocument>('GymClient', GymClientSchema);
