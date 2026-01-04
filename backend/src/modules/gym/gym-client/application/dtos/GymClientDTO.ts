export interface CreateClientRequestDTO {
    gymId: string;
    fullName: string;
    email: string;
    phone: string;
}

export interface UpdateClientRequestDTO {
    clientId: string;
    gymId: string;
    fullName?: string;
    email?: string;
    phone?: string;
}

export interface ClientResponseDTO {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    status: 'active' | 'inactive' | 'expired';
    isEmailVerified: boolean;
    createdAt: Date;
}

export interface ClientListResponseDTO {
    clients: ClientResponseDTO[];
    total: number;
    page: number;
    limit: number;
}
