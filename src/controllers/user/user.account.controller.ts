import { Request, Response } from "express";
import { AccountService } from "../../services/user/user.account.service";

export class AccountController {
  static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const { id_account } = req.user!;
      const profile = await AccountService.getProfile(id_account);

      if (!profile) {
        res.status(404).json({ message: "Profil non trouvé" });
        return;
      }

      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  }

  static async getFilteredPastReservations(req: Request, res: Response): Promise<void> {
    try {
      const { id_account } = req.user!;
      const { date, location, category } = req.query;

      const filters = {
        location: location ? (location as string) : undefined,
        date: date ? (date as string) : undefined,
        category: category ? (category as string) : undefined,
      };

      const [reservations, total] = await AccountService.getFilteredPastReservations(id_account, filters);
      res.json({
        data: reservations,
        total: total
      });
    } catch (error) {
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  }
  
  static async getFilteredFutureReservations(req: Request, res: Response): Promise<void> {
    try {
      const { id_account } = req.user!;
      const { date, location, category } = req.query;

      const filters = {
        location: location ? (location as string) : undefined,
        date: date ? (date as string) : undefined,
        category: category ? (category as string) : undefined,
      };

      const [reservations, total] = await AccountService.getFilteredFutureReservations(id_account, filters);
      res.json({
        data: reservations,
        total: total
      });
    } catch (error) {
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  }
}
