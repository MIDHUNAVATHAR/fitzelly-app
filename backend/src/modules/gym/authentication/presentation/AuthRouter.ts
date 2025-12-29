import { Router } from "express";
import { AuthController } from "./AuthController.js";
import { ENDPOINTS } from "../../../../constants/api.constants.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.post(ENDPOINTS.GYM_AUTH.SIGNUP_INIT, AuthController.initiateSignup);
router.post(ENDPOINTS.GYM_AUTH.SIGNUP_COMPLETE, AuthController.completeSignup);
router.post(ENDPOINTS.GYM_AUTH.LOGIN, AuthController.login);

// protected route
router.get(ENDPOINTS.GYM_AUTH.VERIFY_TOKEN, authenticate, AuthController.verifyToken);


export const gymAuthRouter = router;
