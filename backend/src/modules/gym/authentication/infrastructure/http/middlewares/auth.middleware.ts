import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();
import { GymRepositoryImpl } from "../../repositories/GymRepositoryImpl.js";
import { HttpStatus } from "../../../../../../constants/statusCodes.constants.js";

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Try to get token from Authorization header first (for localStorage access token)
        const authHeader = req.headers.authorization;
        let token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

        // Fallback to cookie if no Bearer token (backward compatibility)
        if (!token) {
            token = req.cookies?.accessToken;
        }

        if (!token) {
            return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Token missing" });
        }

        const payload: any = jwt.verify(token, process.env.JWT_SECRET!);
        const repo = new GymRepositoryImpl();
        const user = await repo.findById(payload.id);

        if (!user) {
            return res.status(HttpStatus.UNAUTHORIZED).json({ message: "User not found" })
        }

        (req as any).user = user;

        next();
    } catch {
        return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Invalid or expired token" });
    }
}

