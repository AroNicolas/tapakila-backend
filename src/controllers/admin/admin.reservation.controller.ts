import { Request, Response } from "express";
import { ReservationService } from "../../services/admin/admin.reservation.service";

export class ReservationController {
  static async getReservationsByEvent(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;

      const [reservations, total] = await ReservationService.getReservationsByEvent(id, Number(page), Number(limit));
      res.json({
        data: reservations,
        total: total
      });

    } catch (error) {
      console.error("Erreur lors de la récupération des réservations :", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  }

  static async cancelReservation(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const updatedReservation = await ReservationService.cancelReservation(id);

      if (!updatedReservation) {
        res.status(404).json({ message: "Réservation non trouvée." });
        return;
      }

      res.json(updatedReservation);
    } catch (error) {
      console.error("Erreur lors de l'annulation de la réservation :", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  }
}
