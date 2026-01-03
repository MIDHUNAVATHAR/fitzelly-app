import { GymPlan } from "../../domain/entities/GymPlan.js";
import { PlanResponseDTO } from "../dtos/GymPlanDTO.js";

export class GymPlanDTOMapper {
    static toResponseDTO(plan: GymPlan): PlanResponseDTO {
        return {
            id: plan.id,
            planName: plan.planName,
            type: plan.type,
            monthlyFee: plan.monthlyFee,
            ...(plan.durationInDays !== undefined ? { durationInDays: plan.durationInDays } : {}),
            ...(plan.description !== undefined ? { description: plan.description } : {}),
            createdAt: plan.createdAt
        };
    }
}
