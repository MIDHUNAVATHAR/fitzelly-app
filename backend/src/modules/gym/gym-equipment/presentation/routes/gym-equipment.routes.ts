import { Router } from "express";
import { GymEquipmentController } from "../controllers/GymEquipmentController.js";
import { authenticate } from "../../../authentication/infrastructure/http/middlewares/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.post("/", GymEquipmentController.createEquipment);
router.get("/", GymEquipmentController.getEquipments);
router.put("/:id", GymEquipmentController.updateEquipment);
router.delete("/:id", GymEquipmentController.deleteEquipment);

export const gymEquipmentRoutes = router;
