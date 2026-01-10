import { Router } from "express";
import { GymEquipmentController } from "../controllers/GymEquipmentController.js";
import { protect } from "../../../../../shared/middlewares/auth.middleware.js";

const router = Router();

router.use(protect(['gym']));

import { upload } from "../../../../../shared/middlewares/upload.middleware.js";

router.post("/", upload.single('photo'), GymEquipmentController.createEquipment);
router.get("/", GymEquipmentController.getEquipments);
router.put("/:id", upload.single('photo'), GymEquipmentController.updateEquipment);
router.delete("/:id", GymEquipmentController.deleteEquipment);

export const gymEquipmentRoutes = router;
