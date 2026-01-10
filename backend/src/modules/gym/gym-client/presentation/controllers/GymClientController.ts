import { Request, Response, NextFunction } from "express";
import { CreateClientUseCase } from "../../application/usecases/CreateClientUseCase.js";
import { GetClientsUseCase } from "../../application/usecases/GetClientsUseCase.js";
import { UpdateClientUseCase } from "../../application/usecases/UpdateClientUseCase.js";
import { GetClientByIdUseCase } from "../../application/usecases/GetClientByIdUseCase.js";
import { DeleteClientUseCase } from "../../application/usecases/DeleteClientUseCase.js";
import { SendClientWelcomeEmailUseCase } from "../../application/usecases/SendClientWelcomeEmailUseCase.js";
import { GymClientRepositoryImpl } from "../../infrastructure/repositories/GymClientRepositoryImpl.js";
import { GymRepositoryImpl } from "../../../authentication/infrastructure/repositories/GymRepositoryImpl.js";
import { HttpStatus, ResponseStatus } from "../../../../../constants/statusCodes.constants.js";
import { CreateClientRequestDTO, UpdateClientRequestDTO } from "../../application/dtos/GymClientDTO.js";
import { OtpRepositoryImpl } from "../../../../client/authentication/infrastructure/repositories/OtpRepositoryImpl.js";
import { EmailServiceImpl } from "../../../authentication/infrastructure/services/EmailServiceImpl.js";

export class GymClientController {
    static async createClient(req: Request, res: Response, next: NextFunction) {
        try {
            const repo = new GymClientRepositoryImpl();
            const useCase = new CreateClientUseCase(repo);
            const user = (req as any).user;

            const dto: CreateClientRequestDTO = {
                gymId: user.id,
                ...req.body
            };

            const result = await useCase.execute(dto);

            res.status(HttpStatus.CREATED).json({
                status: ResponseStatus.SUCCESS,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    static async getClients(req: Request, res: Response, next: NextFunction) {
        try {
            const repo = new GymClientRepositoryImpl();
            const useCase = new GetClientsUseCase(repo);
            const user = (req as any).user;

            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = req.query.search as string | undefined;
            const status = req.query.status as string | undefined;

            const result = await useCase.execute(user.id, page, limit, search, status);

            res.status(HttpStatus.OK).json({
                status: ResponseStatus.SUCCESS,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    static async getClientById(req: Request, res: Response, next: NextFunction) {
        try {
            const repo = new GymClientRepositoryImpl();
            const useCase = new GetClientByIdUseCase(repo);
            const result = await useCase.execute(req.params.id as string);

            res.status(HttpStatus.OK).json({
                status: ResponseStatus.SUCCESS,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    static async updateClient(req: Request, res: Response, next: NextFunction) {
        try {
            const repo = new GymClientRepositoryImpl();
            const useCase = new UpdateClientUseCase(repo);
            const user = (req as any).user;

            const dto: UpdateClientRequestDTO = {
                clientId: req.params.id as string,
                gymId: user.id,
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

    static async deleteClient(req: Request, res: Response, next: NextFunction) {
        try {
            const repo = new GymClientRepositoryImpl();
            const useCase = new DeleteClientUseCase(repo);
            const user = (req as any).user;

            await useCase.execute(req.params.id as string, user.id);

            res.status(HttpStatus.OK).json({
                status: ResponseStatus.SUCCESS,
                message: "Client deleted successfully"
            });
        } catch (error) {
            next(error);
        }
    }
    static async sendWelcomeEmail(req: Request, res: Response, next: NextFunction) {
        try {
            const clientRepo = new GymClientRepositoryImpl();
            const gymRepo = new GymRepositoryImpl();
            const otpRepo = new OtpRepositoryImpl();
            const emailService = new EmailServiceImpl();
            const useCase = new SendClientWelcomeEmailUseCase(clientRepo, gymRepo, otpRepo, emailService);
            const user = (req as any).user;

            await useCase.execute(req.params.id as string, user.id);

            res.status(HttpStatus.OK).json({
                status: ResponseStatus.SUCCESS,
                message: "Welcome email sent successfully"
            });
        } catch (error) {
            next(error);
        }
    }
}
