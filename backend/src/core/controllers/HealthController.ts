import { Request, Response } from "express";
import mongoose from "mongoose";

export class HealthController {
    public static async check(req: Request, res: Response): Promise<void> {

        const dbStatus = mongoose.connection.readyState;
        const isDbConnected = dbStatus == 1;

        const healthData = {
            status: "UP",
            service: "Fitzelly API",
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
            version: "1.0.0",
            database: { connected: isDbConnected }
        }

        res.status(200).json(healthData)
    }
}

/*
normal method , we must create an object to call it
static method directly using the classname 
*/