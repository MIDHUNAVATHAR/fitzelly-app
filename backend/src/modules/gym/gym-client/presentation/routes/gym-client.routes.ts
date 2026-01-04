import { Router } from "express";
import { GymClientController } from "../controllers/GymClientController.js";
import { authenticate } from "../../../authentication/infrastructure/http/middlewares/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.post("/clients", GymClientController.createClient);
router.get("/clients", GymClientController.getClients);
router.put("/clients/:id", GymClientController.updateClient);
router.delete("/clients/:id", GymClientController.deleteClient);

export const gymClientRouter = router;
