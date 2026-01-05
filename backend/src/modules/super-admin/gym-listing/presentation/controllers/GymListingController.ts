import { Request, Response, NextFunction } from "express";
import { GymListingRepositoryImpl } from "../../infrastructure/repositories/GymListingRepositoryImpl.js";
import { GetGymsUseCase } from "../../application/usecases/GetGymsUseCase.js";
import { HttpStatus, ResponseStatus } from "../../../../../constants/statusCodes.constants.js";

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
}
