import { Request, Response, NextFunction } from "express";
import { CreateGymEquipmentUseCase } from "../../application/usecases/CreateGymEquipmentUseCase.js";
import { GetGymEquipmentsUseCase } from "../../application/usecases/GetGymEquipmentsUseCase.js";
import { UpdateGymEquipmentUseCase } from "../../application/usecases/UpdateGymEquipmentUseCase.js";
import { DeleteGymEquipmentUseCase } from "../../application/usecases/DeleteGymEquipmentUseCase.js";
import { GymEquipmentRepositoryImpl } from "../../infrastructure/repositories/GymEquipmentRepositoryImpl.js";
import { S3Service } from "../../../../../shared/services/S3Service.js";
import { HttpStatus, ResponseStatus } from "../../../../../constants/statusCodes.constants.js";

export class GymEquipmentController {
    static async createEquipment(req: Request, res: Response, next: NextFunction) {
        try {
            const repo = new GymEquipmentRepositoryImpl();
            const useCase = new CreateGymEquipmentUseCase(repo);
            const user = (req as any).user;
            const { name, windowTime, condition, photoUrl } = req.body;

            // Handle file upload
            let finalPhotoUrl = photoUrl;
            if (req.file) {
                const s3Service = new S3Service();
                finalPhotoUrl = await s3Service.uploadFile(req.file, `gyms/${user.id}/equipment`);
            }

            const result = await useCase.execute({
                gymId: user.id,
                name,
                photoUrl: finalPhotoUrl,
                windowTime: Number(windowTime),
                condition
            });

            res.status(HttpStatus.CREATED).json({
                status: ResponseStatus.SUCCESS,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    static async getEquipments(req: Request, res: Response, next: NextFunction) {
        try {
            const repo = new GymEquipmentRepositoryImpl();
            const useCase = new GetGymEquipmentsUseCase(repo);
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

    static async updateEquipment(req: Request, res: Response, next: NextFunction) {
        try {
            const repo = new GymEquipmentRepositoryImpl();
            const useCase = new UpdateGymEquipmentUseCase(repo);
            const user = (req as any).user;
            const { id } = req.params;
            const { name, windowTime, condition, photoUrl } = req.body;

            // Handle file upload
            let finalPhotoUrl = photoUrl;
            if (req.file) {
                const s3Service = new S3Service();
                finalPhotoUrl = await s3Service.uploadFile(req.file, `gyms/${user.id}/equipment`);
            }

            const dto: any = {
                name,
                condition
            };

            // Only update photoUrl if it's provided (new file uploaded) or if an explicit URL is sent (though usually we just send file)
            // If file was uploaded, finalPhotoUrl has the new S3 link.
            if (finalPhotoUrl !== undefined) {
                dto.photoUrl = finalPhotoUrl;
            }

            if (windowTime !== undefined) {
                dto.windowTime = Number(windowTime);
            }

            const result = await useCase.execute(id as string, user.id, dto);

            res.status(HttpStatus.OK).json({
                status: ResponseStatus.SUCCESS,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    static async deleteEquipment(req: Request, res: Response, next: NextFunction) {
        try {
            const repo = new GymEquipmentRepositoryImpl();
            const useCase = new DeleteGymEquipmentUseCase(repo);
            const user = (req as any).user;
            const { id } = req.params;

            await useCase.execute(id as string, user.id);

            res.status(HttpStatus.OK).json({
                status: ResponseStatus.SUCCESS,
                message: "Equipment deleted successfully"
            });
        } catch (error) {
            next(error);
        }
    }
}
