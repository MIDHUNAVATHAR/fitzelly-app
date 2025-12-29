import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { AppError } from "./core/errors/AppError.js";
import { HealthController } from "./core/controllers/HealthController.js";
import { API_ROOT, ENDPOINTS } from "./constants/api.constants.js";
import { gymAuthRouter } from "./modules/gym/authentication/presentation/AuthRouter.js";


class App {
    public app: Application;

    constructor() {
        this.app = express();
        this.setupMiddlewares();
        this.setupRoutes();
        this.setupErrorHandling();
    }

    private setupMiddlewares(): void {
        this.app.use(helmet()); // security headers
        this.app.use(
            cors({
              origin: [
                "http://localhost:5173",
                // "https://zonia-noninfected-dawne.ngrok-free.dev",
              ],
              credentials: true,
              methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
              allowedHeaders: ["Content-Type", "Authorization"],
            })
          );  // Enable CORS for our React frontend
        this.app.use(express.json()); // Body parser
        this.app.use(cookieParser());
    }

    private setupRoutes(): void {
        // health check
        this.app.get(`${API_ROOT.V1}${ENDPOINTS.SYSTEM.HEALTH}`, HealthController.check);



        this.app.use(`${API_ROOT.V1}${ENDPOINTS.MODULES.GYM_AUTH}`, gymAuthRouter);
        // this.app.use('/api/v1/super-admin', superAdminRouter);
    }

    private setupErrorHandling(): void {
        // Global Error Middleware
        this.app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
            if (err instanceof AppError) {
                return res.status(err.statusCode).json({
                    status: "error",
                    message: err.message
                })
            }

            // Fallback for unhandled/internal errors
            console.error("Error 💥:", err);
            return res.status(500).json({
                status: "error",
                message: "Something went very wrong"
            })
        })
    }
}

export default new App().app;


/*
Note: verbatimModuleSyntax in tsconfig.json is false; 
if true, only import type {Application, Request, Response, NextFunction}
typescript automatically infer types. 
_next : Yes, I know this variable exists, I’m intentionally not using it . without _ , eslint show warning. 
*/

