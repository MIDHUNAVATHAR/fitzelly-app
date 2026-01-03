import { z } from 'zod';

export const updateProfileSchema = z.object({
    body: z.object({
        ownerName: z.string().optional(),
        gymName: z.string().optional(),
        phone: z.string().optional(),
        description: z.string().optional(),
        address: z.object({
            street: z.string().optional(),
            city: z.string().optional(),
            state: z.string().optional(),
            pincode: z.string().optional(),
            mapLink: z.string().optional(),
        }).optional(),
    }),
});
