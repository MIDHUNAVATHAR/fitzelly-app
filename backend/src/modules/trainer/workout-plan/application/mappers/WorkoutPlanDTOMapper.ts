import type { WorkoutPlan } from "../../domain/entities/WorkoutPlan.js";
import type { WorkoutPlanResponseDTO } from "../dtos/WorkoutPlanDTO.js";

export class WorkoutPlanDTOMapper {
    static toResponseDTO(plan: WorkoutPlan, clientName?: string): WorkoutPlanResponseDTO {
        return {
            id: plan.id,
            trainerId: plan.trainerId,
            clientId: plan.clientId,
            ...(clientName ? { clientName } : {}),
            weeklyPlan: plan.weeklyPlan.map(dayPlan => ({
                day: dayPlan.day,
                exercises: dayPlan.exercises.map(ex => ({
                    name: ex.name,
                    sets: ex.sets,
                    reps: ex.reps,
                    rest: ex.rest,
                })),
                isRestDay: dayPlan.isRestDay,
            })),
            createdAt: plan.createdAt,
            updatedAt: plan.updatedAt,
        };
    }
}
