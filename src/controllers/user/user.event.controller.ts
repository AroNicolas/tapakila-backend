import { Request, Response } from "express";
import { EventService } from "../../services/user/user.event.service";

export class EventController {
  static async getAllEvents(req: Request, res: Response) {
    try {
      const { page, limit } = req.query;
      const events = await EventService.getAllEvents(Number(page), Number(limit));
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  }

  static async getEventById(req: Request, res: Response): Promise<void> {
    try {
      const { id_event } = req.params;
      const event = await EventService.getEventById(id_event);

      if (!event) {
        res.status(404).json({ message: "Événement non trouvé" });
        return;
      }

      res.json(event);
    } catch (error) {
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  }

  static async getFilteredEvents(req: Request, res: Response) {
    try {
      const { date, location, category } = req.params;
      const { page, limit } = req.query;
      const events = await EventService.getFilteredEvents(Number(page), Number(limit), date, location, category);
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  }

  static async searchEventByTitle(req: Request, res: Response) {
    try {
      const { title } = req.params;
      const events = await EventService.searchEventByTitle(title);
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  }
}
