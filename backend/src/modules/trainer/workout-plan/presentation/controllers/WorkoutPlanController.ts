import { Request, Response } from "express";
import { CreateWorkoutPlanUseCase } from "../../application/usecases/CreateWorkoutPlanUseCase.js";
import { UpdateWorkoutPlanUseCase } from "../../application/usecases/UpdateWorkoutPlanUseCase.js";
import { DeleteWorkoutPlanUseCase } from "../../application/usecases/DeleteWorkoutPlanUseCase.js";
import { GetWorkoutPlanByClientIdUseCase } from "../../application/usecases/GetWorkoutPlanByClientIdUseCase.js";
import { HttpStatus } from "../../../../../constants/statusCodes.constants.js";

export class WorkoutPlanController {
    constructor(
        private createWorkoutPlanUseCase: CreateWorkoutPlanUseCase,
        private updateWorkoutPlanUseCase: UpdateWorkoutPlanUseCase,
        private deleteWorkoutPlanUseCase: DeleteWorkoutPlanUseCase,
        private getWorkoutPlanByClientIdUseCase: GetWorkoutPlanByClientIdUseCase
    ) { }

    createWorkoutPlan = async (req: Request, res: Response): Promise<void> => {
        try {
            const trainerId = (req as any).user.id;
            const { clientId, weeklyPlan } = req.body;

            const result = await this.createWorkoutPlanUseCase.execute({
                trainerId,
                clientId,
                weeklyPlan
            });

            res.status(HttpStatus.CREATED).json({
                success: true,
                data: result
            });
        } catch (error: any) {
            res.status(error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message
            });
        }
    };

    updateWorkoutPlan = async (req: Request, res: Response): Promise<void> => {
        try {
            const trainerId = (req as any).user.id;
            const planId = req.params.id as string;
            const { weeklyPlan } = req.body;

            const result = await this.updateWorkoutPlanUseCase.execute({
                planId,
                trainerId,
                weeklyPlan
            });

            res.status(HttpStatus.OK).json({
                success: true,
                data: result
            });
        } catch (error: any) {
            res.status(error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message
            });
        }
    };

    deleteWorkoutPlan = async (req: Request, res: Response): Promise<void> => {
        try {
            const trainerId = (req as any).user.id;
            const planId = req.params.id as string;

            await this.deleteWorkoutPlanUseCase.execute(planId, trainerId);

            res.status(HttpStatus.OK).json({
                success: true,
                message: "Workout plan deleted successfully"
            });
        } catch (error: any) {
            res.status(error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message
            });
        }
    };

    getWorkoutPlanByClientId = async (req: Request, res: Response): Promise<void> => {
        try {
            const trainerId = (req as any).user.id;
            const clientId = req.params.clientId as string;

            const result = await this.getWorkoutPlanByClientIdUseCase.execute(clientId, trainerId);

            res.status(HttpStatus.OK).json({
                success: true,
                data: result
            });
        } catch (error: any) {
            res.status(error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message
            });
        }
    };
}
