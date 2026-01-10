export interface Exercise {
    name: string;
    sets: number;
    reps: number;
    rest: string; // e.g., "60s", "90s"
}

export interface DayPlan {
    day: string; // "Monday", "Tuesday", etc.
    exercises: Exercise[];
    isRestDay: boolean;
}

export class WorkoutPlan {
    constructor(
        public readonly id: string,
        public readonly trainerId: string,
        public readonly clientId: string,
        public readonly weeklyPlan: DayPlan[],
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
    ) { }

    updatePlan(weeklyPlan: DayPlan[]): WorkoutPlan {
        return new WorkoutPlan(
            this.id,
            this.trainerId,
            this.clientId,
            weeklyPlan,
            this.createdAt,
            new Date(),
        );
    }
}
