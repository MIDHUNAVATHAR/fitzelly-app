import mongoose, { Schema, Document } from 'mongoose';

export interface GymDocument extends Document {
    ownerName: string;
    gymName: string;
    phone: string;
    description: string;
    address: {
        street: string;
        city: string;
        state: string;
        pincode: string;
        mapLink: string;
    };
    email: string;
    // ...
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
}

const GymSchema = new Schema<GymDocument>({
    ownerName: { type: String, required: false },
    gymName: { type: String, required: false },
    phone: { type: String, required: false },
    description: { type: String, required: false },
    address: {
        street: { type: String, required: false },
        city: { type: String, required: false },
        state: { type: String, required: false },
        pincode: { type: String, required: false },
        mapLink: { type: String, required: false }
    },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
}, { timestamps: true });

export const GymModel = mongoose.model<GymDocument>('Gym', GymSchema);
