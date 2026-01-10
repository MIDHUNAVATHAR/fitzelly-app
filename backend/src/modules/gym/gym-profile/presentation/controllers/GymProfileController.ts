import { Request, Response, NextFunction } from "express";
import { GymProfileRepositoryImpl } from "../../infrastructure/repositories/GymProfileRepositoryImpl.js";
import { UpdateProfileUseCase } from "../../application/usecases/UpdateProfileUseCase.js";
import { GetProfileUseCase } from "../../application/usecases/GetProfileUseCase.js";
import { HttpStatus, ResponseStatus } from "../../../../../constants/statusCodes.constants.js";
import { S3Service } from "../../../../../shared/services/S3Service.js";
import { AppError } from "../../../../../core/errors/AppError.js";

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

            console.log("GymProfileController: Received update request for user:", userId);
            console.log("GymProfileController: Request body:", req.body);
            console.log("GymProfileController: Request file:", req.file);

            console.log("GymProfileController: Content-Type:", req.headers['content-type']);

            const updateRequest: any = { ...req.body };
            // Ensure email is not updated
            delete updateRequest.email;

            if (req.file) {
                try {
                    const s3Service = new S3Service();
                    const folderPath = `gyms/${userId}/profile`;
                    console.log("GymProfileController: Uploading file to S3...", folderPath);
                    const s3Url = await s3Service.uploadFile(req.file, folderPath);
                    console.log("GymProfileController: S3 Upload success. URL:", s3Url);
                    updateRequest.logoUrl = s3Url;
                } catch (uploadError) {
                    console.error("GymProfileController: S3 Upload failed", uploadError);
                    throw new AppError("Failed to upload logo image", HttpStatus.INTERNAL_SERVER_ERROR);
                }
            } else if (req.headers['content-type']?.includes('multipart/form-data')) {
                console.warn("GymProfileController: Multipart request but NO file found in req.file!");
                // Check if user INTENDED to upload a file? 
                // We can't be sure, but it is suspicious.
            }

            console.log("GymProfileController: Executing use case with payload:", updateRequest);
            const resultDTO = await useCase.execute(userId, updateRequest);
            console.log("GymProfileController: Use case execution successful. Result:", resultDTO);
            console.log("GymProfileController: Result logoUrl:", resultDTO.logoUrl);

            res.status(HttpStatus.OK).json({
                status: ResponseStatus.SUCCESS,
                user: resultDTO
            });
        } catch (error) {
            console.error("GymProfileController: Error updating profile:", error);
            next(error);
        }
    }
}
