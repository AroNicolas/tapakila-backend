import { Router } from "express";
import { AccountController } from "../../controllers/admin/admin.account.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { UserRole } from "../../entities/UserRole";

const router = Router();

router.get("/account/:id", authMiddleware(UserRole.ADMIN), AccountController.getUserById);
router.get("/account", authMiddleware(UserRole.ADMIN), AccountController.getAllUsersFiltered);
router.patch("/account/:id/:role", authMiddleware(UserRole.ADMIN), AccountController.setUserRole);

export default router;
