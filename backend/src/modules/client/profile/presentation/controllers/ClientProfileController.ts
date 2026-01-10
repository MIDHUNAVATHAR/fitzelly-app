import { Request, Response, NextFunction } from "express";
import { GetClientProfileUseCase } from "../../application/usecases/GetClientProfileUseCase.js";
import { UpdateClientProfileUseCase, UpdateClientProfileRequestDTO } from "../../application/usecases/UpdateClientProfileUseCase.js";
import { GymClientRepositoryImpl } from "../../../../gym/gym-client/infrastructure/repositories/GymClientRepositoryImpl.js";
import { GymTrainerRepositoryImpl } from "../../../../gym/gym-trainer/infrastructure/repositories/GymTrainerRepositoryImpl.js";
import { HttpStatus, ResponseStatus } from "../../../../../constants/statusCodes.constants.js";
import { GetAssignedTrainerUseCase } from "../../application/usecases/GetAssignedTrainerUseCase.js";
import { GymRepositoryImpl } from "../../../../gym/authentication/infrastructure/repositories/GymRepositoryImpl.js";
import { S3Service } from "../../../../../shared/services/S3Service.js";
import { AppError } from "../../../../../core/errors/AppError.js";

export class ClientProfileController {
    static async getProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const repo = new GymClientRepositoryImpl();
            const gymRepo = new GymRepositoryImpl();
            const useCase = new GetClientProfileUseCase(repo, gymRepo);
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

            let profilePictureUrl: string | undefined;

            // Handle file upload
            if (req.file) {
                try {
                    const s3Service = new S3Service();
                    const uploadResult = await s3Service.uploadFile(req.file, 'client-profiles');
                    profilePictureUrl = uploadResult;
                } catch (err) {
                    console.error("S3 Upload Error:", err);
                    throw new AppError("Failed to upload profile picture", HttpStatus.INTERNAL_SERVER_ERROR);
                }
            }

            const dto: UpdateClientProfileRequestDTO = {
                clientId: user.id,
                ...req.body,
                ...(profilePictureUrl && { profilePicture: profilePictureUrl })
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

    static async getAssignedTrainer(req: Request, res: Response, next: NextFunction) {
        try {
            const clientRepo = new GymClientRepositoryImpl();
            const trainerRepo = new GymTrainerRepositoryImpl();
            const useCase = new GetAssignedTrainerUseCase(clientRepo, trainerRepo);
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
}
