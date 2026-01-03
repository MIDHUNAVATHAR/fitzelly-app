import mongoose, { Schema, Document } from "mongoose";

export interface IGymPlanDocument extends Document {
    gymId: mongoose.Types.ObjectId;
    planName: string;
    type: 'category' | 'day';
    monthlyFee: number;
    durationInDays?: number;
    description?: string;
    isDelete: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const GymPlanSchema = new Schema<IGymPlanDocument>({
    gymId: { type: Schema.Types.ObjectId, ref: 'Gym', required: true },
    planName: { type: String, required: true },
    type: { type: String, enum: ['category', 'day'], required: true },
    monthlyFee: { type: Number, required: true },
    durationInDays: { type: Number },
    description: { type: String },
    isDelete: { type: Boolean, default: false }
}, { timestamps: true });

export const GymPlanModel = mongoose.model<IGymPlanDocument>('GymPlan', GymPlanSchema);
