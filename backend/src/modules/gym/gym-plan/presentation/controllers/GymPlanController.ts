import { Request, Response, NextFunction } from "express";
import { CreatePlanUseCase } from "../../application/usecases/CreatePlanUseCase.js";
import { GetPlansUseCase } from "../../application/usecases/GetPlansUseCase.js";
import { UpdatePlanUseCase } from "../../application/usecases/UpdatePlanUseCase.js";
import { DeletePlanUseCase } from "../../application/usecases/DeletePlanUseCase.js";
import { GymPlanRepositoryImpl } from "../../infrastructure/repositories/GymPlanRepositoryImpl.js";
import { HttpStatus, ResponseStatus } from "../../../../../constants/statusCodes.constants.js";
import { CreatePlanRequestDTO, UpdatePlanRequestDTO } from "../../application/dtos/GymPlanDTO.js";

export class GymPlanController {
    static async createPlan(req: Request, res: Response, next: NextFunction) {
        try {
            const repo = new GymPlanRepositoryImpl();
            const useCase = new CreatePlanUseCase(repo);

            const user = (req as any).user;
            const dto: CreatePlanRequestDTO = {
                gymId: user.id,
                ...req.body
            };

            const result = await useCase.execute(dto);

            res.status(HttpStatus.CREATED).json({
                status: ResponseStatus.SUCCESS,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    static async getPlans(req: Request, res: Response, next: NextFunction) {
        try {
            const repo = new GymPlanRepositoryImpl();
            const useCase = new GetPlansUseCase(repo);

            const user = (req as any).user;
            const result = await useCase.execute(user.id);

            res.status(HttpStatus.OK).json({
                status: ResponseStatus.SUCCESS,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    static async updatePlan(req: Request, res: Response, next: NextFunction) {
        try {
            const repo = new GymPlanRepositoryImpl();
            const useCase = new UpdatePlanUseCase(repo);

            const user = (req as any).user;
            const dto: UpdatePlanRequestDTO = {
                planId: req.params.id,
                gymId: user.id,
                ...req.body
            };

            const result = await useCase.execute(dto);

            res.status(HttpStatus.OK).json({
                status: ResponseStatus.SUCCESS,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    static async deletePlan(req: Request, res: Response, next: NextFunction) {
        try {
            const repo = new GymPlanRepositoryImpl();
            const useCase = new DeletePlanUseCase(repo);

            const user = (req as any).user;
            if (!req.params.id) {
                res.status(HttpStatus.BAD_REQUEST).json({ message: "Plan ID is required" });
                return;
            }
            await useCase.execute(req.params.id, user.id);

            res.status(HttpStatus.OK).json({
                status: ResponseStatus.SUCCESS,
                message: "Plan deleted successfully"
            });
        } catch (error) {
            next(error);
        }
    }
}
