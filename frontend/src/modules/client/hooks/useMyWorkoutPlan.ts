import { useQuery } from "@tanstack/react-query";
import { ClientWorkoutService } from "../services/ClientWorkoutService";

export const clientWorkoutKeys = {
    myPlan: ['myWorkoutPlan'] as const
};

export function useMyWorkoutPlan() {
    return useQuery({
        queryKey: clientWorkoutKeys.myPlan,
        queryFn: ClientWorkoutService.getMyPlan
    });
}
