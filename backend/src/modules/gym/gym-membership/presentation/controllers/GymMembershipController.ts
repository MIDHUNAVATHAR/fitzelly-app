import { GymMembershipRepositoryImpl } from "../../infrastructure/repositories/GymMembershipRepositoryImpl.js";
import { GymClientRepositoryImpl } from "../../../gym-client/infrastructure/repositories/GymClientRepositoryImpl.js";
import { GetGymMembershipsUseCase } from "../../application/usecases/GetGymMembershipsUseCase.js";
import { DeleteGymMembershipUseCase } from "../../application/usecases/DeleteGymMembershipUseCase.js";
import { CreateGymMembershipUseCase } from "../../application/usecases/CreateGymMembershipUseCase.js";
import { UpdateGymMembershipUseCase } from "../../application/usecases/UpdateGymMembershipUseCase.js";
import { HttpStatus, ResponseStatus } from "../../../../../constants/statusCodes.constants.js";
import { Request, Response, NextFunction } from "express";

export class GymMembershipController {
    static async createMembership(req: Request, res: Response, next: NextFunction) {
        try {
            const repo = new GymMembershipRepositoryImpl();
            const clientRepo = new GymClientRepositoryImpl();
            const useCase = new CreateGymMembershipUseCase(repo, clientRepo);
            const user = (req as any).user;
            const { clientId, planId, startDate, expiredDate, totalPurchasedDays, remainingDays } = req.body;

            const result = await useCase.execute({
                gymId: user.id,
                clientId,
                planId,
                startDate: new Date(startDate),
                expiredDate: expiredDate ? new Date(expiredDate) : null,
                totalPurchasedDays: totalPurchasedDays ? Number(totalPurchasedDays) : null,
                remainingDays: remainingDays ? Number(remainingDays) : null
            });

            res.status(HttpStatus.CREATED).json({
                status: ResponseStatus.SUCCESS,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    static async updateMembership(req: Request, res: Response, next: NextFunction) {
        try {
            const repo = new GymMembershipRepositoryImpl();
            const useCase = new UpdateGymMembershipUseCase(repo);
            const { id } = req.params;
            const { planId, startDate, expiredDate, totalPurchasedDays, remainingDays } = req.body;

            const result = await useCase.execute(id as string, {
                planId,
                startDate: startDate ? new Date(startDate) : undefined,
                expiredDate: expiredDate ? new Date(expiredDate) : (expiredDate === null ? null : undefined),
                totalPurchasedDays: totalPurchasedDays !== undefined ? Number(totalPurchasedDays) : undefined,
                remainingDays: remainingDays !== undefined ? Number(remainingDays) : undefined
            });

            res.status(HttpStatus.OK).json({
                status: ResponseStatus.SUCCESS,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    static async getMemberships(req: Request, res: Response, next: NextFunction) {
        try {
            const repo = new GymMembershipRepositoryImpl();
            const useCase = new GetGymMembershipsUseCase(repo);
            const user = (req as any).user;

            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = req.query.search as string | undefined;
            const planType = req.query.planType as string | undefined;

            // Assuming GetGymMembershipsUseCase signature is execute(gymId, options) or execute(gymId, page, limit...) 
            // Previous read showed it takes separate args? Let's check or stick to previous read.
            // Previous view showed: execute(user.id, page, limit, search, planType)
            // So I will match that.
            const result = await useCase.execute(user.id, page, limit, search, planType);

            res.status(HttpStatus.OK).json({
                status: ResponseStatus.SUCCESS,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    static async deleteMembership(req: Request, res: Response, next: NextFunction) {
        try {
            const repo = new GymMembershipRepositoryImpl();
            const clientRepo = new GymClientRepositoryImpl();
            const useCase = new DeleteGymMembershipUseCase(repo, clientRepo);
            const user = (req as any).user;

            await useCase.execute(req.params.id as string, user.id);

            res.status(HttpStatus.OK).json({
                status: ResponseStatus.SUCCESS,
                message: "Membership deleted successfully"
            });
        } catch (error) {
            next(error);
        }
    }
}
