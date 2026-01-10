import type { IWorkoutPlanRepository } from "../../domain/repositories/IWorkoutPlanRepository.js";
import type { WorkoutPlan } from "../../domain/entities/WorkoutPlan.js";
import { WorkoutPlanModel } from "../database/mongoose/WorkoutPlanSchema.js";
import { WorkoutPlanPersistenceMapper } from "../mappers/WorkoutPlanPersistenceMapper.js";

export class WorkoutPlanRepositoryImpl implements IWorkoutPlanRepository {
    async create(workoutPlan: WorkoutPlan): Promise<WorkoutPlan> {
        const persistenceData = WorkoutPlanPersistenceMapper.toPersistence(workoutPlan);
        const doc = await WorkoutPlanModel.create(persistenceData);
        return WorkoutPlanPersistenceMapper.toDomain(doc);
    }

    async findById(id: string): Promise<WorkoutPlan | null> {
        const doc = await WorkoutPlanModel.findById(id);
        return doc ? WorkoutPlanPersistenceMapper.toDomain(doc) : null;
    }

    async findByClientId(clientId: string): Promise<WorkoutPlan | null> {
        const doc = await WorkoutPlanModel.findOne({ clientId });
        return doc ? WorkoutPlanPersistenceMapper.toDomain(doc) : null;
    }

    async findByTrainerId(trainerId: string, page: number, limit: number): Promise<{ plans: WorkoutPlan[], total: number }> {
        const skip = (page - 1) * limit;
        const [docs, total] = await Promise.all([
            WorkoutPlanModel.find({ trainerId })
                .skip(skip)
                .limit(limit)
                .sort({ updatedAt: -1 }),
            WorkoutPlanModel.countDocuments({ trainerId })
        ]);

        const plans = docs.map(doc => WorkoutPlanPersistenceMapper.toDomain(doc));
        return { plans, total };
    }

    async update(workoutPlan: WorkoutPlan): Promise<WorkoutPlan> {
        const persistenceData = WorkoutPlanPersistenceMapper.toPersistence(workoutPlan);
        const doc = await WorkoutPlanModel.findByIdAndUpdate(
            workoutPlan.id,
            persistenceData,
            { new: true, runValidators: true }
        );
        if (!doc) {
            throw new Error("Workout plan not found");
        }
        return WorkoutPlanPersistenceMapper.toDomain(doc);
    }

    async delete(id: string): Promise<void> {
        await WorkoutPlanModel.findByIdAndDelete(id);
    }
}
