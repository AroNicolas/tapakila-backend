import { Request, Response } from "express";
import { AccountService } from "../../services/admin/admin.account.service";
import { UserRole } from "../../entities/UserRole";

export class AccountController {
  
  static async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const profile = await AccountService.getUserById(id);

      if (!profile) {
        res.status(404).json({ message: "Profil non trouvé" });
        return;
      }

      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  }
  
  static async getAllUsersFiltered(req: Request, res: Response): Promise<void> {
    try {
      const name = req.query.name as string | undefined;
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      
      const [accounts, total] = await AccountService.getAllUsersFiltered(Number(page), Number(limit), name);
      res.json({
        data: accounts,
        total: total
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  }

  static async setUserRole(req: Request, res: Response): Promise<void> {
    try {
      const { id, role } = req.params;

      if (!Object.values(UserRole).includes(role as UserRole)) {
        res.status(400).json({ message: "Rôle invalide." });
        return;
      }

      const updatedUser = await AccountService.setUserRole(id, role as UserRole);

      if (!updatedUser) {
        res.status(404).json({ message: "Utilisateur non trouvé." });
        return;
      }

      res.json(updatedUser);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du rôle :", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  }
}
