import mongoose, { Schema, Document } from 'mongoose';

export interface GymDocument extends Document {
    ownerName: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
}

const GymSchema = new Schema<GymDocument>({
    ownerName: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
}, { timestamps: true });

export const GymModel = mongoose.model<GymDocument>('Gym', GymSchema);
