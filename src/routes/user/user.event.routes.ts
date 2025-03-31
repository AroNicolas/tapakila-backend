import { Router } from "express";
import { EventController } from "../../controllers/user/user.event.controller";

const router = Router();

router.get("/event/locations", EventController.getAllLocations);
router.get("/event/categories", EventController.getAllCategories);
router.get("/event/:id_event", EventController.getEventById);
router.get("/event", EventController.getAllOrFilteredEvents);

export default router;
