import { Router } from "express";
import { GymClientController } from "../controllers/GymClientController.js";
import { protect } from "../../../../../shared/middlewares/auth.middleware.js";

const router = Router();

router.use(protect(['gym']));

router.post("/clients", GymClientController.createClient);
router.get("/clients", GymClientController.getClients);
router.put("/clients/:id", GymClientController.updateClient);
router.delete("/clients/:id", GymClientController.deleteClient);

export const gymClientRouter = router;
