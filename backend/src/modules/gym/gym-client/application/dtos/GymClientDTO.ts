export interface CreateClientRequestDTO {
    gymId: string;
    fullName: string;
    email: string;
    phone: string;
    assignedTrainer?: string;
    emergencyContactNumber?: string;
    dateOfBirth?: Date;
}

export interface UpdateClientRequestDTO {
    clientId: string;
    gymId: string;
    fullName?: string;
    email?: string;
    phone?: string;
    isBlocked?: boolean;
    assignedTrainer?: string;
    emergencyContactNumber?: string;
    dateOfBirth?: Date;
}

export interface ClientResponseDTO {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    status: 'active' | 'inactive' | 'expired';
    isBlocked: boolean;
    isEmailVerified: boolean;
    createdAt: Date;
    assignedTrainer?: string | null;
    emergencyContactNumber?: string;
    dateOfBirth?: Date;
    profilePicture?: string;
    gymName?: string;
    gymLogoUrl?: string;
}

export interface ClientListResponseDTO {
    clients: ClientResponseDTO[];
    total: number;
    page: number;
    limit: number;
}
