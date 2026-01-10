import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TrainerClientsService, type DayPlan } from '../services/TrainerClientsService';
import toast from 'react-hot-toast';

// Query Keys
export const trainerKeys = {
    all: ['trainer'] as const,
    clients: (page: number, limit: number, search: string) => [...trainerKeys.all, 'clients', { page, limit, search }] as const,
    workoutPlan: (clientId: string) => [...trainerKeys.all, 'workoutPlan', clientId] as const,
};

// Fetch assigned clients
export function useAssignedClients(page: number, limit: number, search: string) {
    return useQuery({
        queryKey: trainerKeys.clients(page, limit, search),
        queryFn: () => TrainerClientsService.getAssignedClients(page, limit, search),
        staleTime: 30000, // 30 seconds
    });
}

// Fetch workout plan by client ID
export function useWorkoutPlan(clientId: string, enabled: boolean = true) {
    return useQuery({
        queryKey: trainerKeys.workoutPlan(clientId),
        queryFn: () => TrainerClientsService.getWorkoutPlanByClientId(clientId),
        enabled,
    });
}

// Create workout plan
export function useCreateWorkoutPlan() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ clientId, weeklyPlan }: { clientId: string; weeklyPlan: DayPlan[] }) =>
            TrainerClientsService.createWorkoutPlan(clientId, weeklyPlan),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: trainerKeys.all });
            toast.success('Workout plan created successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create workout plan');
        },
    });
}

// Update workout plan
export function useUpdateWorkoutPlan() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ planId, weeklyPlan }: { planId: string; weeklyPlan: DayPlan[] }) =>
            TrainerClientsService.updateWorkoutPlan(planId, weeklyPlan),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: trainerKeys.all });
            toast.success('Workout plan updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update workout plan');
        },
    });
}

// Delete workout plan
export function useDeleteWorkoutPlan() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (planId: string) => TrainerClientsService.deleteWorkoutPlan(planId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: trainerKeys.all });
            toast.success('Workout plan deleted successfully');
        },
        onError: () => {
            toast.error('Failed to delete workout plan');
        },
    });
}
