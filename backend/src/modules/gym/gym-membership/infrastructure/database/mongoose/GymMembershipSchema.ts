import mongoose, { Schema, Document } from "mongoose";

export interface IGymMembershipDocument extends Document {
    gymId: mongoose.Types.ObjectId;
    clientId: mongoose.Types.ObjectId;
    planId: mongoose.Types.ObjectId;
    startDate: Date;
    expiredDate: Date | null;
    totalPurchasedDays: number | null;
    remainingDays: number | null;
    status: 'active' | 'expired' | 'cancelled';
    isDelete: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const GymMembershipSchema = new Schema<IGymMembershipDocument>({
    gymId: { type: Schema.Types.ObjectId, ref: 'Gym', required: true },
    clientId: { type: Schema.Types.ObjectId, ref: 'GymClient', required: true },
    planId: { type: Schema.Types.ObjectId, ref: 'GymPlan', required: true },
    startDate: { type: Date, required: true },
    expiredDate: { type: Date, required: false, default: null },
    totalPurchasedDays: { type: Number, required: false, default: null },
    remainingDays: { type: Number, required: false, default: null },
    status: { type: String, enum: ['active', 'expired', 'cancelled'], default: 'active' },
    isDelete: { type: Boolean, default: false }
}, { timestamps: true, collection: 'gym memberships' });

export const GymMembershipModel = mongoose.model<IGymMembershipDocument>('GymMembership', GymMembershipSchema);
