import { Request, Response, NextFunction } from "express";
import { GymListingRepositoryImpl } from "../../infrastructure/repositories/GymListingRepositoryImpl.js";
import { GetGymsUseCase } from "../../application/usecases/GetGymsUseCase.js";
import { GetGymDetailsUseCase } from "../../application/usecases/GetGymDetailsUseCase.js";
import { BlockGymUseCase } from "../../application/usecases/BlockGymUseCase.js";
import { DeleteGymUseCase } from "../../application/usecases/DeleteGymUseCase.js";
import { HttpStatus, ResponseStatus } from "../../../../../constants/statusCodes.constants.js";
import { AppError } from "../../../../../core/errors/AppError.js";

export class GymListingController {
    static async getGyms(req: Request, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = req.query.search as string || '';

            const repo = new GymListingRepositoryImpl();
            const useCase = new GetGymsUseCase(repo);

            const result = await useCase.execute({ page, limit, search });

            res.status(HttpStatus.OK).json({
                status: ResponseStatus.SUCCESS,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    static async getGymDetails(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const repo = new GymListingRepositoryImpl();
            const useCase = new GetGymDetailsUseCase(repo);

            const result = await useCase.execute(id as string);

            if (!result) {
                throw new AppError("Gym not found", HttpStatus.NOT_FOUND);
            }

            res.status(HttpStatus.OK).json({
                status: ResponseStatus.SUCCESS,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    static async blockGym(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { isBlocked } = req.body;
            const repo = new GymListingRepositoryImpl();
            const useCase = new BlockGymUseCase(repo);

            await useCase.execute(id as string, isBlocked);

            res.status(HttpStatus.OK).json({
                status: ResponseStatus.SUCCESS,
                message: isBlocked ? "Gym blocked successfully" : "Gym unblocked successfully"
            });
        } catch (error) {
            next(error);
        }
    }

    static async deleteGym(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const repo = new GymListingRepositoryImpl();
            const useCase = new DeleteGymUseCase(repo);

            await useCase.execute(id as string);

            res.status(HttpStatus.OK).json({
                status: ResponseStatus.SUCCESS,
                message: "Gym deleted successfully"
            });
        } catch (error) {
            next(error);
        }
    }
}
