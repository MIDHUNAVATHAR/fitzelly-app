import { Router } from "express";
import { GymMembershipController } from "../controllers/GymMembershipController.js";
import { protect } from "../../../../../shared/middlewares/auth.middleware.js";

const router = Router();

router.use(protect(['gym']));


router.post("/memberships", GymMembershipController.createMembership);
router.put("/memberships/:id", GymMembershipController.updateMembership);
router.get("/memberships", GymMembershipController.getMemberships);
router.delete("/memberships/:id", GymMembershipController.deleteMembership);

export const gymMembershipRouter = router;
