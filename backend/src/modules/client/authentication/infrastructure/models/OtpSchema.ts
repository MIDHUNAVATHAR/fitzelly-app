import mongoose, { Schema, Document } from "mongoose";

export interface IOtpDocument extends Document {
    email: string;
    otp: string;
    expiresAt: Date;
    createdAt: Date;
}

const OtpSchema = new Schema<IOtpDocument>({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true, expires: 0 } // TTL index
}, { timestamps: true });

export const OtpModel = mongoose.models.Otp || mongoose.model<IOtpDocument>('Otp', OtpSchema);
