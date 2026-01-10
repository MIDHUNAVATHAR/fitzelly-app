import { Request, Response, NextFunction } from "express";
import { GetTrainerProfileUseCase } from "../../application/usecases/GetTrainerProfileUseCase.js";
import { UpdateTrainerProfileUseCase, UpdateTrainerProfileRequestDTO } from "../../application/usecases/UpdateTrainerProfileUseCase.js";
import { GymTrainerRepositoryImpl } from "../../../../gym/gym-trainer/infrastructure/repositories/GymTrainerRepositoryImpl.js";
import { HttpStatus, ResponseStatus } from "../../../../../constants/statusCodes.constants.js";

export class TrainerProfileController {
    static async getProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const repo = new GymTrainerRepositoryImpl();
            const useCase = new GetTrainerProfileUseCase(repo);
            const user = (req as any).user;

            // Assuming authentication middleware sets user.id to trainer ID
            const result = await useCase.execute(user.id);

            res.status(HttpStatus.OK).json({
                status: ResponseStatus.SUCCESS,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    static async updateProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const repo = new GymTrainerRepositoryImpl();
            const useCase = new UpdateTrainerProfileUseCase(repo);
            const user = (req as any).user;

            const dto: UpdateTrainerProfileRequestDTO = {
                trainerId: user.id,
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
}
