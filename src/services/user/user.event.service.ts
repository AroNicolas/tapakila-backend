import { AppDataSource } from "../../config/database";
import { EventStatus } from "../../entities/EnventStatus";
import { Event } from "../../entities/Event";

export class EventService {
  static async getEventById(id_event: string) {
    return await AppDataSource.getRepository(Event)
      .createQueryBuilder("event")
      .leftJoinAndSelect("event.ticket_type", "ticket")
      .leftJoinAndSelect("event.image", "image")
      .where("event.id = :id_event", { id_event })
      .andWhere("event.status = :status", { status: EventStatus.PUBLISHED })
      .getOne();
  }

  static async getAllOrFilteredEvents(page: number, limit: number, filters: { date?: string; location?: string; category?: string }) {
    const query = AppDataSource.getRepository(Event)
      .createQueryBuilder("event")
      .leftJoinAndSelect("event.ticket_type", "ticket")
      .leftJoinAndSelect("event.image", "image")
      .where("event.event_date > NOW()")
      .andWhere("event.status = :status", { status: EventStatus.PUBLISHED });
  
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
}
