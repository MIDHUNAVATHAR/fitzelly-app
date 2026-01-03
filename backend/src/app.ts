import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { AppError } from "./core/errors/AppError.js";
import { HealthController } from "./core/controllers/HealthController.js";
import { API_ROOT, ENDPOINTS } from "./constants/api.constants.js";
import { gymAuthRouter } from "./modules/gym/authentication/presentation/routes/gym.routes.js";
import { gymProfileRouter } from "./modules/gym/gym-profile/presentation/routes/gym-profile.routes.js";
import { gymTrainerRouter } from "./modules/gym/gym-trainer/presentation/routes/gym-trainer.routes.js";
import { gymPlanRouter } from "./modules/gym/gym-plan/presentation/routes/gym-plan.routes.js";

class App {
    public app: Application;

    constructor() {
        this.app = express();
        this.setupMiddlewares();
        this.setupRoutes();
        this.setupErrorHandling();
    }

    private setupMiddlewares(): void {
        this.app.use((req, res, next) => {
            console.log(`[Request] ${req.method} ${req.url}`);
            next();
        });
        this.app.use(helmet()); // security headers
        this.app.use(
            cors({
                origin: (origin, callback) => {
                    // Allow requests with no origin (like mobile apps or curl requests)
                    if (!origin) return callback(null, true);
                    // Dynamically allow all origins for debugging
                    return callback(null, true);
                },
                credentials: true,
                methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                allowedHeaders: ["Content-Type", "Authorization", "ngrok-skip-browser-warning"],
            })
        );  // Enable CORS for our React frontend
        this.app.use(express.json()); // Body parser
        this.app.use(cookieParser());
    }

    private setupRoutes(): void {
        // health check
        this.app.get(`${API_ROOT.V1}${ENDPOINTS.SYSTEM.HEALTH}`, HealthController.check);

        this.app.use(`${API_ROOT.V1}${ENDPOINTS.MODULES.GYM_AUTH}`, gymAuthRouter);
        this.app.use(`${API_ROOT.V1}${ENDPOINTS.MODULES.GYM_AUTH}`, gymProfileRouter);
        this.app.use(`${API_ROOT.V1}${ENDPOINTS.MODULES.GYM_PLAN}`, gymPlanRouter);
        this.app.use(`${API_ROOT.V1}${ENDPOINTS.MODULES.GYM_TRAINER}`, gymTrainerRouter);
        // Actually constants usually have GYM_TRAINER. Let's check api.constants.
        // For now I'll use a new constant or just hardcode if needed, but wait, 
        // user said "in the backend, all trainer related codes belongs to gym-trainer folder"
        // I will assume route needs to be mounted.
        // I will check api.constants first to see if I need to add MODULE_ROUTES.GYM_TRAINER.


        // Placeholder routers for Client and Trainer
        // const notImplemented = (req: Request, res: Response) => {
        //     res.status(501).json({
        //         status: "error",
        //         message: "Authentication for this role is not yet implemented."
        //     });
        // };

        //this.app.use(`${API_ROOT.V1}${ENDPOINTS.MODULES.CLIENT_AUTH}`, notImplemented);
        //this.app.use(`${API_ROOT.V1}${ENDPOINTS.MODULES.TRAINER_AUTH}`, notImplemented);

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

