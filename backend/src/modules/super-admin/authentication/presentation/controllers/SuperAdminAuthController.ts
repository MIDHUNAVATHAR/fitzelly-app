import { Request, Response, NextFunction } from "express";
import { SuperAdminRepositoryImpl } from "../../../infrastructure/repositories/SuperAdminRepositoryImpl.js";
import { OtpRepositoryImpl } from "../../../../client/authentication/infrastructure/repositories/OtpRepositoryImpl.js";
import { EmailServiceImpl } from "../../../../gym/authentication/infrastructure/services/EmailServiceImpl.js";
import { BcryptPasswordHasher } from "../../../../gym/authentication/infrastructure/services/BcryptPasswordHasher.js";
import { InitiateSuperAdminPasswordResetUseCase } from "../../application/usecases/InitiateSuperAdminPasswordResetUseCase.js";
import { CompleteSuperAdminPasswordResetUseCase } from "../../application/usecases/CompleteSuperAdminPasswordResetUseCase.js";
import { SuperAdminLoginUseCase } from "../../application/usecases/SuperAdminLoginUseCase.js";
import { HttpStatus, ResponseStatus } from "../../../../../constants/statusCodes.constants.js";
import { TokenService } from "../../../../gym/authentication/infrastructure/services/TokenService.js";

export class SuperAdminAuthController {
    static async initiateReset(req: Request, res: Response, next: NextFunction) {
        try {
            const superAdminRepo = new SuperAdminRepositoryImpl();
            const otpRepo = new OtpRepositoryImpl();
            const emailService = new EmailServiceImpl();

            const useCase = new InitiateSuperAdminPasswordResetUseCase(superAdminRepo, otpRepo, emailService);
            await useCase.execute(req.body);

            res.status(HttpStatus.OK).json({
                status: ResponseStatus.SUCCESS,
                message: "OTP sent successfully"
            });
        } catch (error) {
            next(error);
        }
    }

    static async completeReset(req: Request, res: Response, next: NextFunction) {
        try {
            const superAdminRepo = new SuperAdminRepositoryImpl();
            const otpRepo = new OtpRepositoryImpl();
            const passwordHasher = new BcryptPasswordHasher();

            const useCase = new CompleteSuperAdminPasswordResetUseCase(superAdminRepo, otpRepo, passwordHasher);
            const result = await useCase.execute(req.body);

            // Set refresh token in HttpOnly cookie
            res.cookie('refreshToken', result.tokens.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            // Set access token in HttpOnly cookie
            res.cookie('accessToken', result.tokens.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000 // 15 minutes
            });

            res.status(HttpStatus.OK).json({
                status: ResponseStatus.SUCCESS,
                data: {
                    user: result.user
                },
                accessToken: result.tokens.accessToken // Also return in body for localStorage if needed
            });
        } catch (error) {
            next(error);
        }
    }

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const superAdminRepo = new SuperAdminRepositoryImpl();
            const passwordHasher = new BcryptPasswordHasher();

            const useCase = new SuperAdminLoginUseCase(superAdminRepo, passwordHasher);
            const result = await useCase.execute(req.body);

            // Set refresh token in HttpOnly cookie
            res.cookie('refreshToken', result.tokens.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            // Set access token in HttpOnly cookie
            res.cookie('accessToken', result.tokens.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000 // 15 minutes
            });

            res.status(HttpStatus.OK).json({
                status: ResponseStatus.SUCCESS,
                data: {
                    user: result.user
                },
                accessToken: result.tokens.accessToken
            });
        } catch (error) {
            next(error);
        }
    }

    static async verifyToken(req: Request, res: Response, next: NextFunction) {
        try {
            // User is already attached significantly auth middleware
            const user = (req as any).user;

            res.status(HttpStatus.OK).json({
                status: ResponseStatus.SUCCESS,
                user: {
                    id: user.id,
                    email: user.email,
                    fullName: user.fullName,
                    role: 'super-admin'
                }
            });
        } catch (error) {
            next(error);
        }
    }
}
