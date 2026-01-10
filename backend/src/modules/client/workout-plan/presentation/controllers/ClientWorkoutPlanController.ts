import { NextFunction, Response } from "express";
import { AuthRequest } from "../../../../../shared/middlewares/auth.middleware.js";
import { GetMyWorkoutPlanUseCase } from "../../application/usecases/GetMyWorkoutPlanUseCase.js";
import { HttpStatus } from "../../../../../constants/statusCodes.constants.js";

export class ClientWorkoutPlanController {
    constructor(
        private getMyWorkoutPlanUseCase: GetMyWorkoutPlanUseCase
    ) { }

    getMyPlan = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(HttpStatus.UNAUTHORIZED).json({ message: "Unauthorized" });
                return;
            }

            const plan = await this.getMyWorkoutPlanUseCase.execute(userId);

            res.status(HttpStatus.OK).json({
                status: "success",
                data: plan
            });
        } catch (error) {
            next(error);
        }
    };
}
