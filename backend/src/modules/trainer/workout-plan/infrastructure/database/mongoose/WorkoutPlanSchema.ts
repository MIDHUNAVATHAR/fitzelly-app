import mongoose, { Schema, Document } from "mongoose";

export interface IExerciseDocument {
    name: string;
    sets: number;
    reps: number;
    rest: string;
}

export interface IDayPlanDocument {
    day: string;
    exercises: IExerciseDocument[];
    isRestDay: boolean;
}

export interface IWorkoutPlanDocument extends Document {
    trainerId: mongoose.Types.ObjectId;
    clientId: mongoose.Types.ObjectId;
    weeklyPlan: IDayPlanDocument[];
    createdAt: Date;
    updatedAt: Date;
}

const ExerciseSchema = new Schema<IExerciseDocument>({
    name: { type: String, required: true },
    sets: { type: Number, required: true },
    reps: { type: Number, required: true },
    rest: { type: String, required: true },
}, { _id: false });

const DayPlanSchema = new Schema<IDayPlanDocument>({
    day: { type: String, required: true },
    exercises: [ExerciseSchema],
    isRestDay: { type: Boolean, default: false },
}, { _id: false });

const WorkoutPlanSchema = new Schema<IWorkoutPlanDocument>({
    trainerId: { type: Schema.Types.ObjectId, ref: 'GymTrainer', required: true },
    clientId: { type: Schema.Types.ObjectId, ref: 'GymClient', required: true },
    weeklyPlan: [DayPlanSchema],
}, { timestamps: true });

// Index for efficient queries
WorkoutPlanSchema.index({ trainerId: 1 });
WorkoutPlanSchema.index({ clientId: 1 }, { unique: true });

export const WorkoutPlanModel = mongoose.model<IWorkoutPlanDocument>('WorkoutPlan', WorkoutPlanSchema);
