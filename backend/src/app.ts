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
import { gymClientRouter } from "./modules/gym/gym-client/presentation/routes/gym-client.routes.js";
import { gymPlanRouter } from "./modules/gym/gym-plan/presentation/routes/gym-plan.routes.js";
import { gymMembershipRouter } from "./modules/gym/gym-membership/presentation/routes/gym-membership.routes.js";
import { gymEquipmentRoutes } from "./modules/gym/gym-equipment/presentation/routes/gym-equipment.routes.js";
import { clientAuthRoutes } from "./modules/client/authentication/presentation/routes/clientAuthRoutes.js";
import { trainerAuthRoutes } from "./modules/trainer/authentication/presentation/routes/trainerAuthRoutes.js";
import { superAdminAuthRoutes } from "./modules/super-admin/authentication/presentation/routes/superAdminAuthRoutes.js";
import { gymListingRouter } from "./modules/super-admin/gym-listing/presentation/routes/gymListingRoutes.js";

class App {
    public app: Application;

    constructor() {
        this.app = express();
        this.setupMiddlewares();
        this.setupRoutes();
        this.setupErrorHandling();
    }

    private setupMiddlewares(): void {
        this.app.use(
            cors({
                origin: ['http://localhost:5173', 'http://localhost:3000', 'https://zonia-noninfected-dawne.ngrok-free.dev'],
                credentials: true,
                methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
                allowedHeaders: ["Content-Type", "Authorization", "ngrok-skip-browser-warning", "Access-Control-Allow-Origin"],
                optionsSuccessStatus: 200
            })
        );
        this.app.use((req, res, next) => {
            console.log(`[Request] ${req.method} ${req.url}`);
            next();
        });
        this.app.use(helmet()); // security headers
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
        this.app.use(`${API_ROOT.V1}${ENDPOINTS.MODULES.GYM_CLIENT}`, gymClientRouter);
        this.app.use(`${API_ROOT.V1}${ENDPOINTS.MODULES.GYM_MEMBERSHIP}`, gymMembershipRouter);
        this.app.use(`${API_ROOT.V1}${ENDPOINTS.MODULES.GYM_EQUIPMENT}`, gymEquipmentRoutes);

        this.app.use(`${API_ROOT.V1}${ENDPOINTS.MODULES.CLIENT_AUTH}`, clientAuthRoutes);
        this.app.use(`${API_ROOT.V1}${ENDPOINTS.MODULES.TRAINER_AUTH}`, trainerAuthRoutes);
        this.app.use(`${API_ROOT.V1}${ENDPOINTS.MODULES.SUPER_ADMIN_AUTH}`, superAdminAuthRoutes);
        this.app.use(`${API_ROOT.V1}${ENDPOINTS.MODULES.SUPER_ADMIN_GYM_LISTING}`, gymListingRouter);
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
