import { Request, Response } from "express";
import { GetAssignedClientsUseCase } from "../../application/usecases/GetAssignedClientsUseCase.js";
import { GetAssignedClientDetailsUseCase } from "../../application/usecases/GetAssignedClientDetailsUseCase.js";
import { HttpStatus } from "../../../../../constants/statusCodes.constants.js";
import { WorkoutPlanRepositoryImpl } from "../../../workout-plan/infrastructure/repositories/WorkoutPlanRepositoryImpl.js";

export class AssignedClientsController {
    constructor(
        private getAssignedClientsUseCase: GetAssignedClientsUseCase,
        private getAssignedClientDetailsUseCase: GetAssignedClientDetailsUseCase,
        private workoutPlanRepository: WorkoutPlanRepositoryImpl
    ) { }

    getAssignedClients = async (req: Request, res: Response): Promise<void> => {
        try {
            const trainerId = (req as any).user.id;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = (req.query.search as string) || '';

            const result = await this.getAssignedClientsUseCase.execute(trainerId, page, limit, search);

            // Check which clients have workout plans
            const clientsWithPlanStatus = await Promise.all(
                result.clients.map(async (client) => {
                    const plan = await this.workoutPlanRepository.findByClientId(client.id);
                    return {
                        ...client,
                        hasWorkoutPlan: !!plan
                    };
                })
            );

            res.status(HttpStatus.OK).json({
                success: true,
                data: {
                    ...result,
                    clients: clientsWithPlanStatus
                }
            });
        } catch (error: any) {
            res.status(error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message
            });
        }
    };

    getClientDetails = async (req: Request, res: Response): Promise<void> => {
        try {
            const trainerId = (req as any).user.id;
            const clientId = req.params.id;

            const client = await this.getAssignedClientDetailsUseCase.execute(trainerId, clientId);

            res.status(HttpStatus.OK).json({
                success: true,
                data: client
            });
        } catch (error: any) {
            res.status(error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message
            });
        }
    };
}
