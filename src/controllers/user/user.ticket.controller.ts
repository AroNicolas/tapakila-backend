import { Request, Response } from "express";
import { TicketService } from "../../services/user/user.ticket.service";

export class TicketController {
  static async getTicketAvailability(req: Request, res: Response): Promise<void> {
    try {
      const { id_event, id_ticket_type } = req.params;

      const availableQuantity = await TicketService.getAvailableTickets(id_event, id_ticket_type);

      if (availableQuantity === null) {
        res.status(404).json({ message: "Ticket ou événement introuvable." });
        return;
      }

      res.json({ availableQuantity });
    } catch (error) {
      console.error("Erreur lors de la récupération de la disponibilité des tickets :", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  }
}
