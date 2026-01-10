export interface GymProfileDTO {
    id: string;
    email: string;
    ownerName?: string;
    gymName?: string;
    phone?: string;
    description?: string;
    address?: {
        street?: string;
        city?: string;
        state?: string;
        pincode?: string;
        mapLink?: string;
    };
    logoUrl?: string;
}
