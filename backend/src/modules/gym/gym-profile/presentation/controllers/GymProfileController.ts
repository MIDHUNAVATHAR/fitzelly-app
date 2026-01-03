import { Request, Response, NextFunction } from "express";
import { GymProfileRepositoryImpl } from "../../infrastructure/repositories/GymProfileRepositoryImpl.js";
import { UpdateProfileUseCase } from "../../application/usecases/UpdateProfileUseCase.js";
import { GetProfileUseCase } from "../../application/usecases/GetProfileUseCase.js";
import { HttpStatus, ResponseStatus } from "../../../../../constants/statusCodes.constants.js";

export class GymProfileController {
    static async getProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;
            const gymRepo = new GymProfileRepositoryImpl();
            const useCase = new GetProfileUseCase(gymRepo);

            const resultDTO = await useCase.execute(userId);

            res.status(HttpStatus.OK).json({
                status: ResponseStatus.SUCCESS,
                user: resultDTO
            });
        } catch (error) {
            next(error);
        }
    }

    static async updateProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;
            // Ideally we should inject dependency, but following current pattern of instantiation
            const gymRepo = new GymProfileRepositoryImpl();
            const useCase = new UpdateProfileUseCase(gymRepo);

            const updateRequest = { ...req.body };
            // Ensure email is not updated
            delete (updateRequest as any).email;

            const resultDTO = await useCase.execute(userId, updateRequest);

            res.status(HttpStatus.OK).json({
                status: ResponseStatus.SUCCESS,
                user: resultDTO
            });
        } catch (error) {
            next(error);
        }
    }
}
