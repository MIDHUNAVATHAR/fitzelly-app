export interface ExerciseDTO {
    name: string;
    sets: number;
    reps: number;
    rest: string;
}

export interface DayPlanDTO {
    day: string;
    exercises: ExerciseDTO[];
    isRestDay: boolean;
}

export interface CreateWorkoutPlanRequestDTO {
    trainerId: string;
    clientId: string;
    weeklyPlan: DayPlanDTO[];
}

export interface UpdateWorkoutPlanRequestDTO {
    planId: string;
    trainerId: string;
    weeklyPlan: DayPlanDTO[];
}

export interface WorkoutPlanResponseDTO {
    id: string;
    trainerId: string;
    clientId: string;
    clientName?: string; // Populated from client data
    weeklyPlan: DayPlanDTO[];
    createdAt: Date;
    updatedAt: Date;
}

export interface WorkoutPlanListResponseDTO {
    plans: WorkoutPlanResponseDTO[];
    total: number;
    page: number;
    limit: number;
}
