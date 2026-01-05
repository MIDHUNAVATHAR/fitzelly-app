export interface CreateGymEquipmentDTO {
    gymId: string;
    name: string;
    photoUrl?: string; // Optional initially
    windowTime: number;
    condition?: 'good' | 'bad';
}

export interface UpdateGymEquipmentDTO {
    name?: string;
    photoUrl?: string;
    windowTime?: number;
    condition?: 'good' | 'bad';
}
