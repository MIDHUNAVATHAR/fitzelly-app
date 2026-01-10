import { Request, Response, NextFunction } from "express";
import { GetClientProfileUseCase } from "../../application/usecases/GetClientProfileUseCase.js";
import { UpdateClientProfileUseCase, UpdateClientProfileRequestDTO } from "../../application/usecases/UpdateClientProfileUseCase.js";
import { GymClientRepositoryImpl } from "../../../../gym/gym-client/infrastructure/repositories/GymClientRepositoryImpl.js";
import { HttpStatus, ResponseStatus } from "../../../../../constants/statusCodes.constants.js";

export class ClientProfileController {
    static async getProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const repo = new GymClientRepositoryImpl();
            const useCase = new GetClientProfileUseCase(repo);
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

    static async updateProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const repo = new GymClientRepositoryImpl();
            const useCase = new UpdateClientProfileUseCase(repo);
            const user = (req as any).user;

            const dto: UpdateClientProfileRequestDTO = {
                clientId: user.id,
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
