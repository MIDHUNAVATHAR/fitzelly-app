import mongoose, { Schema, Document } from "mongoose";

export interface IGymTrainerDocument extends Document {
    gymId: mongoose.Types.ObjectId;
    fullName: string;
    email: string;
    phone: string;
    specialization: string;
    monthlySalary: number;

    password?: string;
    isEmailVerified: boolean;
    isEmailVerified: boolean;
    isDelete: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const GymTrainerSchema = new Schema<IGymTrainerDocument>({
    gymId: { type: Schema.Types.ObjectId, ref: 'Gym', required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String },
    specialization: { type: String, default: '' },
    monthlySalary: { type: Number, default: 0 },

    isEmailVerified: { type: Boolean, default: false },
    isDelete: { type: Boolean, default: false }
}, { timestamps: true });

export const GymTrainerModel = mongoose.model<IGymTrainerDocument>('GymTrainer', GymTrainerSchema);
