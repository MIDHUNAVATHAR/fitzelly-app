import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();
import { MongooseGymRepository } from "../infrastructure/persistence/mongoose/MongooseGymRepository.js";

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.cookies?.accessToken;

        if (!token) {
            return res.status(401).json({ message: "Token missing" });
        }

        const payload: any = jwt.verify(token, process.env.JWT_SECRET!);
        const repo = new MongooseGymRepository();
        const user = await repo.findById(payload.id);

        if (!user) {
            return res.status(401).json({ message: "User not found" })
        }

        (req as any).user = user;
        
        next();
    } catch {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}