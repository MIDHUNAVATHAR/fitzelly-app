import { Router } from "express";
import { GymEquipmentController } from "../controllers/GymEquipmentController.js";
import { protect } from "../../../../../shared/middlewares/auth.middleware.js";

const router = Router();

router.use(protect(['gym']));

router.post("/", GymEquipmentController.createEquipment);
router.get("/", GymEquipmentController.getEquipments);
router.put("/:id", GymEquipmentController.updateEquipment);
router.delete("/:id", GymEquipmentController.deleteEquipment);

export const gymEquipmentRoutes = router;
