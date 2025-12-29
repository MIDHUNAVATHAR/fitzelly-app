import { Router } from "express";
import { AuthController } from "./AuthController.js";
import { ENDPOINTS } from "../../../../constants/api.constants.js";

const router = Router();

router.post(ENDPOINTS.GYM_AUTH.SIGNUP_INIT, AuthController.initiateSignup);
router.post(ENDPOINTS.GYM_AUTH.SIGNUP_COMPLETE, AuthController.completeSignup);
router.post(ENDPOINTS.GYM_AUTH.LOGIN, AuthController.login);

export const gymAuthRouter = router;
