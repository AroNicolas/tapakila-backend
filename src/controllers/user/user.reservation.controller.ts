import { Request, Response } from "express";
import { ReservationService } from "../../services/user/user.reservation.service";

export class ReservationController {
  static async cancelReservation(req: Request, res: Response): Promise<void> {
    try {

      if (!req.user) {
        res.status(401).json({ message: "Utilisateur non authentifié." });
        return;
      }
      
      const { id_reservation } = req.params;
      const { id_account } = req.user; // Récupération de l'utilisateur connecté

      const reservation = await ReservationService.cancelReservation(id_reservation, id_account);
      
      if (!reservation) {
        res.status(404).json({ message: "Réservation non trouvée." });
        return;
      }

      res.status(200).json(reservation);
    } catch (error) {
      console.error("Erreur lors de l'annulation de la réservation:", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  }
}
