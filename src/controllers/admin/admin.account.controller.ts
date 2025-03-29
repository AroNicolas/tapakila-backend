import { Request, Response } from "express";
import { AccountService } from "../../services/admin/admin.account.service";
import { UserRole } from "../../entities/UserRole";

export class AccountController {
  static async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const { page, limit } = req.query;
      
      const users = await AccountService.getAllUsers(Number(page), Number(limit));
      res.json(users);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  }

  static async getUserByName(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.params;
      const user = await AccountService.getUserByName(name);

      if (!user) {
        res.status(404).json({ message: "Utilisateur non trouvé" });
        return; 
      }

      res.json(user);
    } catch (error) {
      console.error("Erreur lors de la recherche de l'utilisateur :", error);
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
