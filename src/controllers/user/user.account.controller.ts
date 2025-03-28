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

  static async getPastReservations(req: Request, res: Response): Promise<void> {
    try {
      const { id_account } = req.user!;
      const reservations = await AccountService.getPastReservations(id_account);

      res.json(reservations);
    } catch (error) {
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  }

  static async getFutureReservations(req: Request, res: Response): Promise<void> {
    try {
      const { id_account } = req.user!;
      const reservations = await AccountService.getFutureReservations(id_account);

      res.json(reservations);
    } catch (error) {
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  }

  static async getFilteredPastReservations(req: Request, res: Response): Promise<void> {
    try {
      const { id_account } = req.user!;
      const { date, location, category } = req.params;

      const filteredReservations = await AccountService.getFilteredPastReservations(id_account, { date, location, category });

      res.json(filteredReservations);
    } catch (error) {
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  }
}
