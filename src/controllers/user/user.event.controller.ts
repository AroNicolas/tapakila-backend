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
      const { date, location, category, title } = req.query;
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;

      const filters = {
        location: location ? (location as string) : undefined,
        date: date ? (date as string) : undefined,
        category: category ? (category as string) : undefined,
        title: title ? (title as string) : undefined
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

  static async getAllLocations(req: Request, res: Response): Promise<void> { 
    try {
      const locations = await EventService.getAllLocations();
  
      if (locations.length === 0) { 
        res.status(404).json({ message: "Aucun lieu trouvé" });
      }
  
      res.json(locations);
    } catch (error) {
      console.error("Erreur lors de la récupération des lieux :", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  }
  
  static async getAllCategories(req: Request, res: Response): Promise<void> { 
    try {
      const categories = await EventService.getAllCategories();
  
      if (categories.length === 0) { 
        res.status(404).json({ message: "Aucune catégorie trouvé" });
      }
  
      res.json(categories);
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories :", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  }
  
}
