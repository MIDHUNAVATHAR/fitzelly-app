export interface CreateTrainerRequestDTO {
    gymId: string;
    fullName: string;
    email: string;
    phone: string;
    specialization?: string;
    monthlySalary?: number;
}

export interface UpdateTrainerRequestDTO {
    trainerId: string;
    gymId: string;
    fullName?: string;
    email?: string;
    phone?: string;
    specialization?: string;
    monthlySalary?: number;
    status?: 'active' | 'blocked' | 'pending';
}

export interface TrainerResponseDTO {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    specialization: string;
    monthlySalary: number;
    status: 'active' | 'blocked' | 'pending';
    createdAt: Date;
}

export interface TrainerListResponseDTO {
    trainers: TrainerResponseDTO[];
    total: number;
    page: number;
    limit: number;
}
