import { WorkoutPlan, type DayPlan, type Exercise } from "../../domain/entities/WorkoutPlan.js";
import type { IWorkoutPlanDocument, IDayPlanDocument, IExerciseDocument } from "../database/mongoose/WorkoutPlanSchema.js";
import mongoose from "mongoose";

export class WorkoutPlanPersistenceMapper {
    static toDomain(doc: IWorkoutPlanDocument): WorkoutPlan {
        const weeklyPlan: DayPlan[] = doc.weeklyPlan.map((dayPlan: IDayPlanDocument) => ({
            day: dayPlan.day,
            exercises: dayPlan.exercises.map((ex: IExerciseDocument) => ({
                name: ex.name,
                sets: ex.sets,
                reps: ex.reps,
                rest: ex.rest,
            })),
            isRestDay: dayPlan.isRestDay,
        }));

        return new WorkoutPlan(
            doc._id.toString(),
            doc.trainerId.toString(),
            doc.clientId.toString(),
            weeklyPlan,
            doc.createdAt,
            doc.updatedAt
        );
    }

    static toPersistence(entity: WorkoutPlan): Partial<IWorkoutPlanDocument> {
        return {
            ...(entity.id && mongoose.Types.ObjectId.isValid(entity.id) ? { _id: new mongoose.Types.ObjectId(entity.id) as any } : {}),
            trainerId: new mongoose.Types.ObjectId(entity.trainerId),
            clientId: new mongoose.Types.ObjectId(entity.clientId),
            weeklyPlan: entity.weeklyPlan.map(dayPlan => ({
                day: dayPlan.day,
                exercises: dayPlan.exercises.map(ex => ({
                    name: ex.name,
                    sets: ex.sets,
                    reps: ex.reps,
                    rest: ex.rest,
                })),
                isRestDay: dayPlan.isRestDay,
            })),
        };
    }
}
