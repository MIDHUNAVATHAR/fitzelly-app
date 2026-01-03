import { Router } from "express";
import { GymController } from "../controllers/GymController.js";
import { ROUTER_ENDPOINTS } from "../../../../../constants/api.constants.js";
import { authenticate } from "../../infrastructure/http/middlewares/auth.middleware.js";
import { validateRequest } from "../../../../../shared/middlewares/validateRequest.js";
import {
    initiateSignupSchema,
    completeSignupSchema,
    loginSchema,
    initiateForgotPasswordSchema,
    resetPasswordSchema
} from "../schemas/auth.schemas.js";

const router = Router();


router.post(ROUTER_ENDPOINTS.GYM_AUTH.SIGNUP_INIT, validateRequest(initiateSignupSchema), GymController.initiateSignup);
router.post(ROUTER_ENDPOINTS.GYM_AUTH.SIGNUP_COMPLETE, validateRequest(completeSignupSchema), GymController.completeSignup);
router.post(ROUTER_ENDPOINTS.GYM_AUTH.LOGIN, validateRequest(loginSchema), GymController.login);
// Google Auth (Redirect Flow)
router.get(ROUTER_ENDPOINTS.GYM_AUTH.GOOGLE_AUTH_INIT, GymController.initiateGoogleLogin);
router.get(ROUTER_ENDPOINTS.GYM_AUTH.GOOGLE_AUTH_CALLBACK, GymController.handleGoogleCallback);

router.post(ROUTER_ENDPOINTS.GYM_AUTH.LOGOUT, GymController.logout);

// Forgot Password Routes
router.post(ROUTER_ENDPOINTS.GYM_AUTH.FORGOT_PASSWORD_INIT, validateRequest(initiateForgotPasswordSchema), GymController.initiateForgotPassword);
router.post(ROUTER_ENDPOINTS.GYM_AUTH.RESET_PASSWORD, validateRequest(resetPasswordSchema), GymController.resetPassword);

// protected route
router.get(ROUTER_ENDPOINTS.GYM_AUTH.VERIFY_TOKEN, authenticate, GymController.verifyToken);


export const gymAuthRouter = router;
