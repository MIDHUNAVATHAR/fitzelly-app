import { Request, Response, NextFunction } from "express";
import { CreateTrainerUseCase } from "../../application/usecases/CreateTrainerUseCase.js";
import { GetTrainersUseCase } from "../../application/usecases/GetTrainersUseCase.js";
import { UpdateTrainerUseCase } from "../../application/usecases/UpdateTrainerUseCase.js";
import { DeleteTrainerUseCase } from "../../application/usecases/DeleteTrainerUseCase.js";
import { GymTrainerRepositoryImpl } from "../../infrastructure/repositories/GymTrainerRepositoryImpl.js";
import { HttpStatus, ResponseStatus } from "../../../../../constants/statusCodes.constants.js";
import { CreateTrainerRequestDTO, UpdateTrainerRequestDTO } from "../../application/dtos/GymTrainerDTO.js";

export class GymTrainerController {
    static async createTrainer(req: Request, res: Response, next: NextFunction) {
        try {
            const repo = new GymTrainerRepositoryImpl();
            const useCase = new CreateTrainerUseCase(repo);
            const user = (req as any).user;

            const dto: CreateTrainerRequestDTO = {
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

    static async getTrainers(req: Request, res: Response, next: NextFunction) {
        try {
            const repo = new GymTrainerRepositoryImpl();
            const useCase = new GetTrainersUseCase(repo);
            const user = (req as any).user;

            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = req.query.search as string | undefined;

            const result = await useCase.execute(user.id, page, limit, search);

            res.status(HttpStatus.OK).json({
                status: ResponseStatus.SUCCESS,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    static async updateTrainer(req: Request, res: Response, next: NextFunction) {
        try {
            const repo = new GymTrainerRepositoryImpl();
            const useCase = new UpdateTrainerUseCase(repo);
            const user = (req as any).user;

            const dto: UpdateTrainerRequestDTO = {
                trainerId: req.params.id,
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

    static async deleteTrainer(req: Request, res: Response, next: NextFunction) {
        try {
            const repo = new GymTrainerRepositoryImpl();
            const useCase = new DeleteTrainerUseCase(repo);
            const user = (req as any).user;

            await useCase.execute(req.params.id, user.id);

            res.status(HttpStatus.OK).json({
                status: ResponseStatus.SUCCESS,
                message: "Trainer deleted successfully"
            });
        } catch (error) {
            next(error);
        }
    }
}
