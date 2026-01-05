import mongoose, { Document, Schema } from 'mongoose';

export interface IGymEquipmentDocument extends Document {
    gymId: mongoose.Types.ObjectId;
    name: string;
    photoUrl: string;
    windowTime: number;
    condition: 'good' | 'bad';
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const GymEquipmentSchema = new Schema<IGymEquipmentDocument>({
    gymId: { type: Schema.Types.ObjectId, ref: 'GymProfile', required: true, index: true },
    name: { type: String, required: true, trim: true },
    photoUrl: { type: String, default: '' },
    windowTime: { type: Number, required: true },
    condition: { type: String, enum: ['good', 'bad'], default: 'good' },
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true
});

export const GymEquipmentModel = mongoose.model<IGymEquipmentDocument>('GymEquipment', GymEquipmentSchema);
