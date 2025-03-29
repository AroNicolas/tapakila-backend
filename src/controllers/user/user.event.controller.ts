import { Request, Response } from "express";
import { EventService } from "../../services/user/user.event.service";

export class EventController {

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

  static async getAllOrFilteredEvents(req: Request, res: Response) {
    try {
      const { date, location, category } = req.query;
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;

      const filters = {
        location: location ? (location as string) : undefined,
        date: date ? (date as string) : undefined,
        category: category ? (category as string) : undefined,
      };

      const [events, total] = await EventService.getAllOrFilteredEvents(page, limit, filters);
      res.json({
        data: events,
        total: total
      });
    } catch (error) {
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  }

  static async searchEventByTitle(req: Request, res: Response) {
    try {
      const { title } = req.params;
      const [events, total] = await EventService.searchEventByTitle(title);
      res.json({
        data: events,
        total: total
      });
    } catch (error) {
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  }
}
