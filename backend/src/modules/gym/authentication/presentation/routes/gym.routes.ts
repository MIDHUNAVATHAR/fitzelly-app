import { Router } from "express";
import { GymController } from "../controllers/GymController.js";
import { ROUTER_ENDPOINTS } from "../../../../../constants/api.constants.js";
import { authenticate } from "../../infrastructure/http/middlewares/auth.middleware.js";

const router = Router();


router.post(ROUTER_ENDPOINTS.GYM_AUTH.SIGNUP_INIT, GymController.initiateSignup);
router.post(ROUTER_ENDPOINTS.GYM_AUTH.SIGNUP_COMPLETE, GymController.completeSignup);
router.post(ROUTER_ENDPOINTS.GYM_AUTH.LOGIN, GymController.login);
router.post(ROUTER_ENDPOINTS.GYM_AUTH.GOOGLE_LOGIN, GymController.googleLogin);
// Google Auth (Redirect Flow)
router.get(ROUTER_ENDPOINTS.GYM_AUTH.GOOGLE_AUTH_INIT, GymController.initiateGoogleLogin);
router.get(ROUTER_ENDPOINTS.GYM_AUTH.GOOGLE_AUTH_CALLBACK, GymController.handleGoogleCallback);

router.post(ROUTER_ENDPOINTS.GYM_AUTH.LOGOUT, GymController.logout);

// Forgot Password Routes
router.post(ROUTER_ENDPOINTS.GYM_AUTH.FORGOT_PASSWORD_INIT, GymController.initiateForgotPassword);
router.post(ROUTER_ENDPOINTS.GYM_AUTH.RESET_PASSWORD, GymController.resetPassword);

// protected route
router.get(ROUTER_ENDPOINTS.GYM_AUTH.VERIFY_TOKEN, authenticate, GymController.verifyToken);


export const gymAuthRouter = router;
