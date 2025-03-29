import { Request, Response } from "express";
import { EventService } from "../../services/admin/admin.event.service";
import { EventStatus } from "../../entities/EnventStatus";
import { Image } from "../../entities/Image";

export class EventController {
  static async getEventById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const event = await EventService.getEventById(id);

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

  static async createEvent(req: Request, res: Response): Promise<void> {
    try {
      const { title, description, event_date, location, organizer, category, status } = req.body;
      const imageFile = req.file; // Récupérer l'image envoyée via `multer`

      // Construire l'objet image avec l'url du fichier téléchargé (si un fichier est envoyé)
      const image = imageFile ? { url: `uploads/${imageFile.filename}` } as Image & { url: string } : undefined;

      // Appeler le service avec les données de l'événement et l'image
      const event = await EventService.createEvent({
        title,
        description,
        event_date: new Date(event_date),
        location,
        organizer,
        category,
        status,
        image // Passer l'objet image avec l'URL
      });
      

      res.status(201).json(event);
    } catch (error) {
      console.error("Erreur lors de la création de l'événement:", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  }

  static async updateEvent(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updatedData = req.body;

      const updatedEvent = await EventService.updateEvent(id, updatedData);

      if (!updatedEvent) {
        res.status(404).json({ message: "Événement non trouvé" });
        return;
      }

      res.status(200).json(updatedEvent);
    } catch (error) {
      console.error("Erreur lors de la modification de l'événement:", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  }

  static async deleteEvent(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const deleted = await EventService.deleteEvent(id);

      if (!deleted) {
        res.status(404).json({ message: "Événement non trouvé" });
        return;
      }

      res.status(204).send();
    } catch (error) {
      console.error("Erreur lors de la suppression de l'événement:", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  }

  static async updateEventStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id, status } = req.params;

      // Validate or cast status to EventStatus
      const validStatus: EventStatus = status as EventStatus;

      const updatedEvent = await EventService.updateEventStatus(id, validStatus);

      if (!updatedEvent) {
        res.status(404).json({ message: "Événement non trouvé" });
        return;
      }

      res.status(200).json(updatedEvent);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  }

  static async createTicketType(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { ticket_name, price, buying_limit } = req.body;

      const ticket = await EventService.createTicketType(id, {
        ticket_name,
        price,
        buying_limit,
      });

      res.status(201).json(ticket);
    } catch (error) {
      console.error("Erreur lors de la création du type de ticket:", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  }
}
