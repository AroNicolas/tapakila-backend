import { Router } from "express";
import { AccountController } from "../../controllers/user/user.account.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { UserRole } from "../../entities/UserRole";

const router = Router();

router.get("/account/profile", authMiddleware(UserRole.USER), AccountController.getProfile);
router.get("/account/reservation/past", authMiddleware(UserRole.USER), AccountController.getPastReservations);
router.get("/account/reservation/future", authMiddleware(UserRole.USER), AccountController.getFutureReservations);
router.get("/account/reservation/past/:date?/:location?/:category?", authMiddleware(UserRole.USER), AccountController.getFilteredPastReservations);

export default router;
