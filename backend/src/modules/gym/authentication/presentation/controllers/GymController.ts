import { Request, Response, NextFunction } from "express";
import { SignupGymUseCase, CompleteSignupRequest } from "../../application/usecases/SignupGymUseCase.js";
import { InitiateSignupUseCase } from "../../application/usecases/InitiateSignupUseCase.js";
import { LoginGymUseCase } from "../../application/usecases/LoginGymUseCase.js";
import { ResetPasswordUseCase } from "../../application/usecases/ResetPasswordUseCase.js";
import { GymRepositoryImpl } from "../../infrastructure/repositories/GymRepositoryImpl.js";
import { OtpRepositoryImpl } from "../../infrastructure/repositories/OtpRepositoryImpl.js";
import { EmailServiceImpl } from "../../infrastructure/services/EmailServiceImpl.js";
import { BcryptPasswordHasher } from "../../infrastructure/services/BcryptPasswordHasher.js";
import { GoogleAuthService } from "../../infrastructure/services/GoogleAuthService.js";
import { GoogleAuthGymUseCase } from "../../application/usecases/GoogleAuthGymUseCase.js";
import { LoginGymRequestDTO } from "../../application/dtos/LoginGymDTO.js";
import { HttpStatus, ResponseStatus } from "../../../../../constants/statusCodes.constants.js";

export class GymController {

    // Step 1: Request OTP
    static async initiateSignup(req: Request, res: Response, next: NextFunction) {
        console.log("Received initiateSignup Request:", req.body);
        try {
            const gymRepo = new GymRepositoryImpl();
            const otpRepo = new OtpRepositoryImpl();
            const emailService = new EmailServiceImpl();
            const useCase = new InitiateSignupUseCase(gymRepo, otpRepo, emailService);

            const { email } = req.body;



            await useCase.execute({ email });

            res.status(HttpStatus.OK).json({
                status: ResponseStatus.SUCCESS,
                message: "OTP sent to email successfully"
            });
        } catch (error) {
            next(error);
        }
    }

    // Step 2: Verify OTP & Create Account
    static async completeSignup(req: Request, res: Response, next: NextFunction) {
        try {
            const gymRepo = new GymRepositoryImpl();
            const otpRepo = new OtpRepositoryImpl();
            const passwordHasher = new BcryptPasswordHasher();
            const useCase = new SignupGymUseCase(gymRepo, otpRepo, passwordHasher);

            const requestDTO: CompleteSignupRequest = {   //CompleteSignpRequest is the extension for SignupDTO 
                email: req.body.email,
                password: req.body.password,
                otp: req.body.otp
            };



            const resultDTO = await useCase.execute(requestDTO);

            // Set refresh token in HTTP-only cookie
            // Set refresh token in HTTP-only cookie
            res.cookie('refreshToken', resultDTO.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            // Return access token in response body for localStorage
            const { refreshToken, ...responsePayload } = resultDTO;

            res.status(HttpStatus.CREATED).json({
                status: ResponseStatus.SUCCESS,
                ...responsePayload
            });
        } catch (error) {
            next(error);
        }
    }

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const repo = new GymRepositoryImpl();
            const passwordHasher = new BcryptPasswordHasher();
            const useCase = new LoginGymUseCase(repo, passwordHasher);

            const requestDTO: LoginGymRequestDTO = {
                email: req.body.email,
                password: req.body.password
            };



            const resultDTO = await useCase.execute(requestDTO);

            // Set refresh token in HTTP-only cookie
            // Set refresh token in HTTP-only cookie
            res.cookie('refreshToken', resultDTO.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            // Return access token in response body for localStorage
            const { refreshToken, ...responsePayload } = resultDTO;

            res.status(HttpStatus.OK).json({
                status: ResponseStatus.SUCCESS,
                ...responsePayload
            });

        } catch (error) {
            next(error);
        }
    }

    // Traditional Redirect Flow
    static async initiateGoogleLogin(req: Request, res: Response, next: NextFunction) {
        try {
            const role = (req.query.role as string) || 'gym';
            const state = JSON.stringify({ role });

            const googleAuthService = new GoogleAuthService();
            const url = googleAuthService.generateAuthUrl(state);
            res.redirect(url);
        } catch (error) {
            next(error);
        }
    }

    static async handleGoogleCallback(req: Request, res: Response, next: NextFunction) {
        try {
            const { code, error } = req.query;

            if (error) {
                return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/?error=google_auth_failed`);
            }

            if (!code) {
                return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/?error=no_code`);
            }

            const gymRepo = new GymRepositoryImpl();
            const googleAuthService = new GoogleAuthService();
            const useCase = new GoogleAuthGymUseCase(gymRepo, googleAuthService);

            // Create account / Login
            const resultDTO = await useCase.execute(code as string);

            // Set Refresh Token (HTTP Only)
            res.cookie('refreshToken', resultDTO.refreshToken, {
                httpOnly: true,
                secure: true, // Required for SameSite=None
                sameSite: 'none',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            // Redirect to Dashboard
            let frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
            // Remove trailing slash if present
            if (frontendUrl.endsWith('/')) {
                frontendUrl = frontendUrl.slice(0, -1);
            }

            // Only pass accessToken in URL for localStorage
            // refreshToken is already in HttpOnly cookie
            const redirectUrl = `${frontendUrl}/gym/dashboard?accessToken=${resultDTO.accessToken}&role=gym`;
            console.log("Google Login Success, Redirecting to:", redirectUrl);

            res.redirect(redirectUrl);


        } catch (error) {
            console.error("Google Callback Error:", error);
            res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/?error=login_failed`);
        }
    }



    static async verifyToken(req: Request, res: Response, next: NextFunction) {
        // middleware attaches user to req
        const user = (req as any).user;

        return res.status(HttpStatus.OK).json({
            success: true,
            user: {
                id: user.id,
                ...(user.ownerName ? { ownerName: user.ownerName } : {}),
                ...(user.gymName ? { gymName: user.gymName } : {}),
                ...(user.phone ? { phone: user.phone } : {}),
                ...(user.description ? { description: user.description } : {}),
                ...(user.address ? {
                    address: {
                        ...(user.address.street ? { street: user.address.street } : {}),
                        ...(user.address.city ? { city: user.address.city } : {}),
                        ...(user.address.state ? { state: user.address.state } : {}),
                        ...(user.address.pincode ? { pincode: user.address.pincode } : {}),
                        ...(user.address.mapLink ? { mapLink: user.address.mapLink } : {}),
                    }
                } : {}),
                email: user.email
            }
        })
    }

    static async logout(req: Request, res: Response, next: NextFunction) {
        try {
            // Clear refresh token cookie
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: true,
                sameSite: 'none'
            });



            return res.status(HttpStatus.OK).json({
                status: ResponseStatus.SUCCESS,
                message: "Logged out successfully"
            });
        } catch (error) {
            next(error);
        }
    }

    // Forgot Password Flow
    static async initiateForgotPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const gymRepo = new GymRepositoryImpl();
            const otpRepo = new OtpRepositoryImpl();
            const emailService = new EmailServiceImpl();
            const { InitiateForgotPasswordUseCase } = await import("../../application/usecases/InitiateForgotPasswordUseCase.js");
            const useCase = new InitiateForgotPasswordUseCase(gymRepo, otpRepo, emailService);

            const { email } = req.body;



            await useCase.execute({ email });

            res.status(HttpStatus.OK).json({
                status: ResponseStatus.SUCCESS,
                message: "If this email exists, an OTP has been sent"
            });
        } catch (error) {
            next(error);
        }
    }

    static async resetPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const gymRepo = new GymRepositoryImpl();
            const otpRepo = new OtpRepositoryImpl();
            const passwordHasher = new BcryptPasswordHasher();
            const useCase = new ResetPasswordUseCase(gymRepo, otpRepo, passwordHasher);

            const { email, otp, newPassword } = req.body;



            await useCase.execute({ email, otp, newPassword });

            res.status(HttpStatus.OK).json({
                status: ResponseStatus.SUCCESS,
                message: "Password reset successfully"
            });
        } catch (error) {
            next(error);
        }
    }

    static async refreshToken(req: Request, res: Response, next: NextFunction) {
        try {
            const refreshToken = req.cookies.refreshToken;

            const { RefreshTokenUseCase } = await import("../../application/usecases/RefreshTokenUseCase.js");
            const useCase = new RefreshTokenUseCase();

            const result = await useCase.execute(refreshToken);

            res.status(HttpStatus.OK).json({
                status: ResponseStatus.SUCCESS,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }



}


