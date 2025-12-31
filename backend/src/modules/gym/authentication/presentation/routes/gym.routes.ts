import { Router } from "express";
import { GymController } from "../controllers/GymController.js";
import { ENDPOINTS } from "../../../../../constants/api.constants.js";
import { authenticate } from "../../infrastructure/http/middlewares/auth.middleware.js";

const router = Router();

router.post(ENDPOINTS.GYM_AUTH.SIGNUP_INIT, GymController.initiateSignup);
router.post(ENDPOINTS.GYM_AUTH.SIGNUP_COMPLETE, GymController.completeSignup);
router.post(ENDPOINTS.GYM_AUTH.LOGIN, GymController.login);
router.post(ENDPOINTS.GYM_AUTH.LOGOUT, GymController.logout);

// protected route
router.get(ENDPOINTS.GYM_AUTH.VERIFY_TOKEN, authenticate, GymController.verifyToken);


export const gymAuthRouter = router;
