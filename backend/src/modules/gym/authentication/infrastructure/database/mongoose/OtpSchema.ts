import mongoose, { Schema, Document } from 'mongoose';

export interface OtpDocument extends Document {
    email: string;
    otp: string;
    expiresAt: Date;
}

const OtpSchema = new Schema<OtpDocument>({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true, expires: 0 } // TTL index: auto-delete after expiry
}, { timestamps: true });

export const OtpModel = mongoose.model<OtpDocument>('Otp', OtpSchema);
