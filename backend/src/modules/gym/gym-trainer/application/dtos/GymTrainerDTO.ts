export interface CreateTrainerRequestDTO {
    gymId: string;
    fullName: string;
    email: string;
    phone: string;
    specialization?: string;
    monthlySalary?: number;
    isBlocked?: boolean;
}

export interface UpdateTrainerRequestDTO {
    trainerId: string;
    gymId: string;
    fullName?: string;
    email?: string;
    phone?: string;
    specialization?: string;
    monthlySalary?: number;
    isBlocked?: boolean;
}

export interface TrainerResponseDTO {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    specialization: string;
    monthlySalary: number;
    isBlocked: boolean;
    isEmailVerified: boolean;
    createdAt: Date;
}

export interface TrainerListResponseDTO {
    trainers: TrainerResponseDTO[];
    total: number;
    page: number;
    limit: number;
}
