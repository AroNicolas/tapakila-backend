import { Router } from "express";
import { EventController } from "../../controllers/user/user.event.controller";

const router = Router();

router.get("/event/:id_event", EventController.getEventById);
router.get("/event", EventController.getAllOrFilteredEvents);
router.get("/event/:title", EventController.searchEventByTitle);

export default router;
