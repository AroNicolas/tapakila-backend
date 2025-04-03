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
      const { id } = req.user; // Récupération de l'utilisateur connecté

      const reservation = await ReservationService.cancelReservation(id_reservation, id);
      
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

  static async createReservation(req: Request, res: Response): Promise<void> {
    try {
      const id_event = req.params.id_event;
      const { id } = req.user!; // Récupération du user via le middleware d'authentification
      const { tickets } = req.body; // Liste des tickets { id_ticket, quantity }

      if (!id) {
        res.status(401).json({ message: "Utilisateur non authentifié." });
        return;
      }

      const reservation = await ReservationService.createReservation(id, id_event, tickets);

      res.status(201).json(reservation);
    } catch (error) {
      console.error("Erreur lors de la création de la réservation:", error);
      res.status(500).json({ message: "Erreur interne du serveur." });
    }
  }
}
