import { Request, Response, NextFunction } from "express";
import { GymTrainerRepositoryImpl } from "../../../../gym/gym-trainer/infrastructure/repositories/GymTrainerRepositoryImpl.js";
import { OtpRepositoryImpl } from "../../../../client/authentication/infrastructure/repositories/OtpRepositoryImpl.js";
import { EmailServiceImpl } from "../../../../gym/authentication/infrastructure/services/EmailServiceImpl.js";
import { BcryptPasswordHasher } from "../../../../gym/authentication/infrastructure/services/BcryptPasswordHasher.js";
import { InitiateTrainerPasswordResetUseCase } from "../../application/usecases/InitiateTrainerPasswordResetUseCase.js";
import { CompleteTrainerPasswordResetUseCase } from "../../application/usecases/CompleteTrainerPasswordResetUseCase.js";
import { TrainerLoginUseCase } from "../../application/usecases/TrainerLoginUseCase.js";
import { HttpStatus, ResponseStatus } from "../../../../../constants/statusCodes.constants.js";
import { ROLES } from "../../../../../constants/roles.constants.js";

export class TrainerAuthController {

    static async initiateReset(req: Request, res: Response, next: NextFunction) {
        try {
            const trainerRepo = new GymTrainerRepositoryImpl();
            const otpRepo = new OtpRepositoryImpl();
            const emailService = new EmailServiceImpl();
            const useCase = new InitiateTrainerPasswordResetUseCase(trainerRepo, otpRepo, emailService);

            await useCase.execute(req.body);

            res.status(HttpStatus.OK).json({
                status: ResponseStatus.SUCCESS,
                message: "OTP sent to email"
            });
        } catch (error) {
            next(error);
        }
    }

    static async completeReset(req: Request, res: Response, next: NextFunction) {
        try {
            const trainerRepo = new GymTrainerRepositoryImpl();
            const otpRepo = new OtpRepositoryImpl();
            const passwordHasher = new BcryptPasswordHasher();
            const useCase = new CompleteTrainerPasswordResetUseCase(trainerRepo, otpRepo, passwordHasher);

            const result = await useCase.execute(req.body);

            // Set HttpOnly Cookies (Only refresh token)
            res.cookie('refreshToken', result.tokens.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7d
            });

            res.status(HttpStatus.OK).json({
                status: ResponseStatus.SUCCESS,
                data: result.user,
                accessToken: result.tokens.accessToken
            });
        } catch (error) {
            next(error);
        }
    }

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const trainerRepo = new GymTrainerRepositoryImpl();
            const passwordHasher = new BcryptPasswordHasher();
            const useCase = new TrainerLoginUseCase(trainerRepo, passwordHasher);

            const result = await useCase.execute(req.body);

            // Set HttpOnly Cookies
            res.cookie('refreshToken', result.tokens.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7d
            });

            res.status(HttpStatus.OK).json({
                status: ResponseStatus.SUCCESS,
                user: result.user,
                accessToken: result.tokens.accessToken
            });
        } catch (error) {
            next(error);
        }
    }

    static async logout(req: Request, res: Response, next: NextFunction) {
        try {
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });
            res.status(HttpStatus.OK).json({ message: "Logged out successfully" });
        } catch (error) {
            next(error);
        }
    }

    static async verifyToken(req: Request, res: Response, next: NextFunction) {
        try {
            const user = (req as any).user;
            if (!user) {
                return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Not authenticated" });
            }

            // Fetch Gym Details to include branding
            let gymName = 'FITZELLE';
            let gymLogoUrl = '';

            if (user.gymId) {
                const { GymRepositoryImpl } = await import("../../../../gym/authentication/infrastructure/repositories/GymRepositoryImpl.js");
                const gymRepo = new GymRepositoryImpl();
                const gym = await gymRepo.findById(user.gymId);
                if (gym) {
                    gymName = gym.gymName || gymName;
                    gymLogoUrl = gym.logoUrl || '';
                }
            }

            // Return user data
            const userData = {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                role: ROLES.TRAINER,
                gymId: user.gymId,
                gymName: gymName,
                gymLogoUrl: gymLogoUrl
            };

            res.status(HttpStatus.OK).json({
                status: ResponseStatus.SUCCESS,
                user: userData
            });
        } catch (error) {
            next(error);
        }
    }
}
