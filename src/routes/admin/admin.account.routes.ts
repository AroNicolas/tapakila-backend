import { Router } from "express";
import { AccountController } from "../../controllers/admin/admin.account.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { UserRole } from "../../entities/UserRole";

const router = Router();

router.get("/account", authMiddleware(UserRole.ADMIN), AccountController.getAllUsers);
router.get("/account/:name", authMiddleware(UserRole.ADMIN), AccountController.getUserByName);
router.patch("/account/:id/:role", authMiddleware(UserRole.ADMIN), AccountController.setUserRole);

export default router;
