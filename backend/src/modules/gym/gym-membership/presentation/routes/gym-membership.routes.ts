import { Router } from "express";
import { GymMembershipController } from "../controllers/GymMembershipController.js";
import { authenticate } from "../../../authentication/infrastructure/http/middlewares/auth.middleware.js";

const router = Router();

router.use(authenticate);


router.post("/memberships", GymMembershipController.createMembership);
router.put("/memberships/:id", GymMembershipController.updateMembership);
router.get("/memberships", GymMembershipController.getMemberships);
router.delete("/memberships/:id", GymMembershipController.deleteMembership);

export const gymMembershipRouter = router;
