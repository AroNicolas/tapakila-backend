import { Router } from "express";
import { ReservationController } from "../../controllers/user/user.reservation.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { UserRole } from "../../entities/UserRole";

const router = Router();

router.patch("/reservation/:id_reservation/cancel", authMiddleware(UserRole.USER), ReservationController.cancelReservation);
router.post("/reservation/event/:id_event", authMiddleware(UserRole.USER), ReservationController.createReservation);

export default router;
