import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthService } from '../../landing/services/AuthService';
import { ROLES } from '../../../constants/roles';
import toast from 'react-hot-toast';

export const gymProfileKeys = {
    profile: ['gymProfile'] as const,
};

export function useGymProfile() {
    return useQuery({
        queryKey: gymProfileKeys.profile,
        queryFn: async () => {
            const data = await AuthService.verifyToken(ROLES.GYM);
            return data?.user || null;
        },
    });
}

export function useUpdateGymProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: any) => AuthService.updateProfile(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: gymProfileKeys.profile });
            // Trigger AuthContext to refresh its user state as well so Header/Layout updates
            window.dispatchEvent(new Event('auth-change'));
            toast.success('Gym details updated successfully');
        },
        onError: (error: any) => {
            console.error(error);
            toast.error(error.message || 'Failed to update gym details');
        },
    });
}
