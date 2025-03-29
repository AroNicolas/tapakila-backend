import { Router } from "express";
import { ReservationController } from "../../controllers/admin/admin.reservation.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { UserRole } from "../../entities/UserRole";

const router = Router();

router.get("/reservation/event/:id", authMiddleware(UserRole.ADMIN), ReservationController.getReservationsByEvent);
router.post("/reservation/:id/cancel", authMiddleware(UserRole.ADMIN), ReservationController.cancelReservation);

export default router;
