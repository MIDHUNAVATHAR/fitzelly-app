import { Request, Response, NextFunction } from "express";
import { GetTrainerProfileUseCase } from "../../application/usecases/GetTrainerProfileUseCase.js";
import { UpdateTrainerProfileUseCase, UpdateTrainerProfileRequestDTO } from "../../application/usecases/UpdateTrainerProfileUseCase.js";
import { GymTrainerRepositoryImpl } from "../../../../gym/gym-trainer/infrastructure/repositories/GymTrainerRepositoryImpl.js";
import { HttpStatus, ResponseStatus } from "../../../../../constants/statusCodes.constants.js";

import { GymRepositoryImpl } from "../../../../gym/authentication/infrastructure/repositories/GymRepositoryImpl.js";
import { S3Service } from "../../../../../shared/services/S3Service.js";
import { AppError } from "../../../../../core/errors/AppError.js";

export class TrainerProfileController {
    static async getProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const repo = new GymTrainerRepositoryImpl();
            const gymRepo = new GymRepositoryImpl();
            const useCase = new GetTrainerProfileUseCase(repo, gymRepo);
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

            let profilePictureUrl: string | undefined;

            // Handle file upload
            if (req.file) {
                try {
                    const s3Service = new S3Service();
                    const uploadResult = await s3Service.uploadFile(req.file, 'trainer-profiles');
                    profilePictureUrl = uploadResult;
                } catch (err) {
                    console.error("S3 Upload Error:", err);
                    throw new AppError("Failed to upload profile picture", HttpStatus.INTERNAL_SERVER_ERROR);
                }
            }

            const dto: UpdateTrainerProfileRequestDTO = {
                trainerId: user.id,
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
}
