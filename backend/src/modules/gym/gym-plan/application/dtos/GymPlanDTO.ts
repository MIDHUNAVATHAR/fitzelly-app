export interface CreatePlanRequestDTO {
    gymId: string;
    planName: string;
    type: 'category' | 'day';
    monthlyFee: number;
    durationInDays?: number;
    description?: string;
}

export interface UpdatePlanRequestDTO {
    planId: string;
    gymId: string; // ensuring ownership
    planName?: string;
    monthlyFee?: number;
    durationInDays?: number;
    description?: string;
}

export interface PlanResponseDTO {
    id: string;
    planName: string;
    type: 'category' | 'day';
    monthlyFee: number;
    durationInDays?: number;
    description?: string;
    createdAt: Date;
}
