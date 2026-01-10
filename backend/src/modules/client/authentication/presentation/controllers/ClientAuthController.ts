import { Request, Response, NextFunction } from "express";
import { InitiateClientPasswordResetUseCase } from "../../application/usecases/InitiateClientPasswordResetUseCase.js";
import { CompleteClientPasswordResetUseCase } from "../../application/usecases/CompleteClientPasswordResetUseCase.js";
import { ClientLoginUseCase } from "../../application/usecases/ClientLoginUseCase.js";
import { GymClientRepositoryImpl } from "../../../../gym/gym-client/infrastructure/repositories/GymClientRepositoryImpl.js";
import { OtpRepositoryImpl } from "../../infrastructure/repositories/OtpRepositoryImpl.js";
import { EmailServiceImpl } from "../../../../gym/authentication/infrastructure/services/EmailServiceImpl.js";
import { BcryptPasswordHasher } from "../../../../gym/authentication/infrastructure/services/BcryptPasswordHasher.js";
import { HttpStatus, ResponseStatus } from "../../../../../constants/statusCodes.constants.js";
import { ROLES } from "../../../../../constants/roles.constants.js";

export class ClientAuthController {
    // Step 1: Request OTP
    static async initiateReset(req: Request, res: Response, next: NextFunction) {
        try {
            const clientRepo = new GymClientRepositoryImpl();
            const otpRepo = new OtpRepositoryImpl();
            const emailService = new EmailServiceImpl();
            const useCase = new InitiateClientPasswordResetUseCase(clientRepo, otpRepo, emailService);

            await useCase.execute(req.body);

            res.status(HttpStatus.OK).json({
                status: ResponseStatus.SUCCESS,
                message: "OTP sent to email"
            });
        } catch (error) {
            next(error);
        }
    }

    // Step 2 & 3: Verify OTP and Set Password (combined as per request)
    // "client confirm otp, then , create a password... marks email verified then issue tokens"
    // The prompt says "client confirm otp, then create password". 
    // Usually confirming OTP is one step, then setting password is next.
    // BUT the final step "after setting password, marks... verified then issue tokens" suggests the token is issued AFTER password set.
    // So we can have one endpoint: verify-otp-and-set-password?
    // OR: 
    // 1. Initiate (Send OTP)
    // 2. Verify OTP check (Optional, UI can do this step to allow password screen) -> Backend just checks OTP exists?
    // 3. Set Password (sends Email, OTP, NewPassword) -> Backend verifies OTP again and updates.
    // I will implement "resetPassword" which takes Email, OTP, NewPassword. 
    // The UI can validate OTP first if it wants, but the final action requires valid OTP.

    static async completeReset(req: Request, res: Response, next: NextFunction) {
        try {
            const clientRepo = new GymClientRepositoryImpl();
            const otpRepo = new OtpRepositoryImpl();
            const passwordHasher = new BcryptPasswordHasher();
            const useCase = new CompleteClientPasswordResetUseCase(clientRepo, otpRepo, passwordHasher);

            const result = await useCase.execute(req.body);

            // Set HttpOnly Cookies
            // accessToken removed as requested


            res.cookie('refreshToken', result.tokens.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7d
            });

            res.status(HttpStatus.OK).json({
                status: ResponseStatus.SUCCESS,
                data: result.user
            });
        } catch (error) {
            next(error);
        }
    }

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const clientRepo = new GymClientRepositoryImpl();
            const passwordHasher = new BcryptPasswordHasher();
            const useCase = new ClientLoginUseCase(clientRepo, passwordHasher);

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
                accessToken: result.tokens.accessToken // Optional, for frontend context if needed, but cookies are primary
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

            // Return user data, ensuring we don't send password
            const userData = {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                role: ROLES.CLIENT,
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
