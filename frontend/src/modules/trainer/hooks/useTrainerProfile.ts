import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TrainerProfileService } from '../services/TrainerProfileService';
import type { Trainer } from '../../gym/services/TrainerService';
import toast from 'react-hot-toast';

export const trainerProfileKeys = {
    profile: ['trainerProfile'] as const,
};

export function useTrainerProfile() {
    return useQuery({
        queryKey: trainerProfileKeys.profile,
        queryFn: () => TrainerProfileService.getProfile(),
    });
}

export function useUpdateTrainerProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Partial<Trainer> | FormData) => TrainerProfileService.updateProfile(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: trainerProfileKeys.profile });
            toast.success('Profile updated successfully');
        },
        onError: () => {
            toast.error('Failed to update profile');
        },
    });
}
