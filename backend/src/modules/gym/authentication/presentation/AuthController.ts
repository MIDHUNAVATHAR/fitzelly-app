import { Request, Response, NextFunction } from "express";
import { SignupGymUseCase, CompleteSignupRequest } from "../usecases/SignupGymUseCase.js";
import { InitiateSignupUseCase } from "../usecases/InitiateSignupUseCase.js";
import { LoginGymUseCase } from "../usecases/LoginGymUseCase.js";
import { MongooseGymRepository } from "../infrastructure/persistence/mongoose/MongooseGymRepository.js";
import { LoginGymRequestDTO } from "../domain/dtos/LoginGymDTO.js";

export class AuthController {

    // Step 1: Request OTP
    static async initiateSignup(req: Request, res: Response, next: NextFunction) {
        console.log("Received initiateSignup Request:", req.body);
        try {
            const repo = new MongooseGymRepository();
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
            const repo = new MongooseGymRepository();
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

            res.status(201).json({
                status: "success",
                ...resultDTO
            });
        } catch (error) {
            next(error);
        }
    }

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const repo = new MongooseGymRepository();
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

            res.status(200).json({
                status: "success",
                ...resultDTO
            });

        } catch (error) {
            next(error);
        }
    }
}
