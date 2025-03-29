import { Router } from "express";
import { EventController } from "../../controllers/admin/admin.event.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { UserRole } from "../../entities/UserRole";
import upload from "../../middlewares/image.upload.middleware"; // Multer pour l'upload d'images

const router = Router();

router.get("/event/:id", EventController.getEventById);
router.get("/event", EventController.getAllOrFilteredEvents);
router.get("/event/:title", EventController.searchEventByTitle);
router.post("/event", authMiddleware(UserRole.ADMIN), upload.array("image"), EventController.createEvent);
router.put("/event/:id", authMiddleware(UserRole.ADMIN), EventController.updateEvent);
router.delete("/event/:id", authMiddleware(UserRole.ADMIN), EventController.deleteEvent);
router.patch("/event/:id/:status", authMiddleware(UserRole.ADMIN), EventController.updateEventStatus);
router.post("/event/:id/ticket", authMiddleware(UserRole.ADMIN), EventController.createTicketType);

export default router;