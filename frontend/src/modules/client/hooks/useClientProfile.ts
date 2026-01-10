import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ClientProfileService } from '../services/ClientProfileService';
import type { Client } from '../../gym/services/ClientService';
import toast from 'react-hot-toast';

export const clientProfileKeys = {
    profile: ['clientProfile'] as const,
};

export function useClientProfile() {
    return useQuery({
        queryKey: clientProfileKeys.profile,
        queryFn: () => ClientProfileService.getProfile(),
    });
}

export function useUpdateClientProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Partial<Client> | FormData) => ClientProfileService.updateProfile(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: clientProfileKeys.profile });
            toast.success('Profile updated successfully');
        },
        onError: () => {
            toast.error('Failed to update profile');
        },
    });
}
