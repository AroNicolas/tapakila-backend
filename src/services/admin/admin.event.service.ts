import { AppDataSource } from "../../config/database";
import { Event } from "../../entities/Event";
import { TicketType } from "../../entities/TicketType";
import { Image } from "../../entities/Image";
import { EventStatus } from "../../entities/EnventStatus";

export class EventService {
  static async getEventById(id: string) {
    return await AppDataSource.getRepository(Event)
      .createQueryBuilder("event")
      .leftJoinAndSelect("event.ticket_type", "ticket")
      .leftJoinAndSelect("event.image", "image")
      .where("event.id = :id", { id })
      .getOne();
  }

  static async getAllOrFilteredEvents(page: number, limit: number, filters: { date?: string; location?: string; category?: string }) {
    const query = AppDataSource.getRepository(Event)
      .createQueryBuilder("event")
      .leftJoinAndSelect("event.ticket_type", "ticket")
      .leftJoinAndSelect("event.image", "image");
  
    if (filters.date) query.andWhere("DATE(event.event_date) = :date", { date: filters.date });
    if (filters.location) query.andWhere("LOWER(event.location) LIKE LOWER(:location)", { location: `%${filters.location}%` });
    if (filters.category) query.andWhere("event.category = :category", { category: filters.category });
  
    const [events, total] =  await query.orderBy("event.event_date", "ASC").skip((page - 1) * limit).take(limit).getManyAndCount();
    return [events, total];
  }

  static async searchEventByTitle(title: string) {
    const query =  AppDataSource.getRepository(Event)
      .createQueryBuilder("event")
      .leftJoinAndSelect("event.ticket_type", "ticket")
      .leftJoinAndSelect("event.image", "image")
      .where("event.event_date > NOW()")
      .andWhere("LOWER(event.title) LIKE LOWER(:title)", { title: `%${title}%` })
      .andWhere("event.status = :status", { status: EventStatus.PUBLISHED })

      const [events, total] = await query.getManyAndCount();  // getManyAndCount renvoie [data, totalCount]
      return [events, total];  // Données + Total
  }

  static async createEvent(eventData: Partial<Event> & { image?: { url: string } }): Promise<Event> {
    const eventRepository = AppDataSource.getRepository(Event);
    const imageRepository = AppDataSource.getRepository(Image);
  
    // Création de l'événement sans l'image
    const newEvent = eventRepository.create(eventData);
    await eventRepository.save(newEvent);
  
    // Ajout de l'image si elle existe
    if (eventData.image) {
      // Crée l'image et associe-la à l'événement
      const image = imageRepository.create({ url: eventData.image.url, event: newEvent });
      await imageRepository.save(image);
      newEvent.image = image; // Associer l'image à l'événement
    }
  
    return newEvent;
  }

  static async updateEvent(id: string, updatedData: Partial<Event>): Promise<Event | null> {
    const eventRepository = AppDataSource.getRepository(Event);
    const event = await eventRepository.findOne({ where: { id_event: id } });

    if (!event) return null;

    Object.assign(event, updatedData);
    return await eventRepository.save(event);
  }

  static async deleteEvent(id: string): Promise<boolean> {
    const eventRepository = AppDataSource.getRepository(Event);
    const deleteResult = await eventRepository.delete(id);
    return (deleteResult.affected ?? 0) > 0;
  }

  static async updateEventStatus(id: string, status: EventStatus): Promise<Event | null> {
    const eventRepository = AppDataSource.getRepository(Event);
    const event = await eventRepository.findOne({ where: { id_event: id } });

    if (!event) return null;

    event.status = status;
    return await eventRepository.save(event);
  }

  static async createTicketType(id: string, ticketData: Partial<TicketType>): Promise<TicketType> {
    const ticketRepository = AppDataSource.getRepository(TicketType);
    const newTicket = ticketRepository.create({ ...ticketData, event: { id_event: id } });
    return await ticketRepository.save(newTicket);
  }
}
