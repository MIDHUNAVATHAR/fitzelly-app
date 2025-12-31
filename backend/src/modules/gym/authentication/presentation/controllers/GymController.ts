import { Request, Response, NextFunction } from "express";
import { SignupGymUseCase, CompleteSignupRequest } from "../../application/usecases/SignupGymUseCase.js";
import { InitiateSignupUseCase } from "../../application/usecases/InitiateSignupUseCase.js";
import { LoginGymUseCase } from "../../application/usecases/LoginGymUseCase.js";
import { GymRepositoryImpl } from "../../infrastructure/repositories/GymRepositoryImpl.js";
import { LoginGymRequestDTO } from "../../application/dtos/LoginGymDTO.js";

export class GymController {

    // Step 1: Request OTP
    static async initiateSignup(req: Request, res: Response, next: NextFunction) {
        console.log("Received initiateSignup Request:", req.body);
        try {
            const repo = new GymRepositoryImpl();
            const useCase = new InitiateSignupUseCase(repo);

            const { email } = req.body;

            if (!email) {
                res.status(400).json({ status: "error", message: "Email is required" });
                return;
            }

            await useCase.execute({ email });

            res.status(200).json({
                status: "success",
                message: "OTP sent to email successfully"
            });
        } catch (error) {
            next(error);
        }
    }

    // Step 2: Verify OTP & Create Account
    static async completeSignup(req: Request, res: Response, next: NextFunction) {
        try {
            const repo = new GymRepositoryImpl();
            const useCase = new SignupGymUseCase(repo);

            const requestDTO: CompleteSignupRequest = {
                gymName: req.body.gymName,
                email: req.body.email,
                password: req.body.password,
                otp: req.body.otp
            };

            if (!requestDTO.gymName || !requestDTO.email || !requestDTO.password || !requestDTO.otp) {
                res.status(400).json({ status: "error", message: "Missing required fields" });
                return;
            }

            const resultDTO = await useCase.execute(requestDTO);

            // Set Cookies
            res.cookie('accessToken', resultDTO.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax', // Lax is better for navigation from landing page often
                maxAge: 15 * 60 * 1000 // 15 min
            });

            res.cookie('refreshToken', resultDTO.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            // Remove tokens from response body logic
            const { accessToken, refreshToken, ...responsePayload } = resultDTO;

            res.status(201).json({
                status: "success",
                ...responsePayload
            });
        } catch (error) {
            next(error);
        }
    }

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const repo = new GymRepositoryImpl();
            const useCase = new LoginGymUseCase(repo);

            const requestDTO: LoginGymRequestDTO = {
                email: req.body.email,
                password: req.body.password
            };

            if (!requestDTO.email || !requestDTO.password) {
                res.status(400).json({ status: "error", message: "Missing email or password" });
                return;
            }

            const resultDTO = await useCase.execute(requestDTO);

            // Set Cookies
            res.cookie('accessToken', resultDTO.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 15 * 60 * 1000 // 15 min
            });

            res.cookie('refreshToken', resultDTO.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            const { accessToken, refreshToken, ...responsePayload } = resultDTO;

            res.status(200).json({
                status: "success",
                ...responsePayload
            });

        } catch (error) {
            next(error);
        }
    }

    static async verifyToken(req: Request, res: Response, next: NextFunction) {
        // middleware attaches user to req
        const user = (req as any).user;

        return res.status(200).json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        })
    }

    static async logout(req: Request, res: Response, next: NextFunction) {
        try {
            // Clear both access and refresh tokens
            res.clearCookie('accessToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax'
            });

            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax'
            });

            return res.status(200).json({
                status: "success",
                message: "Logged out successfully"
            });
        } catch (error) {
            next(error);
        }
    }
}


