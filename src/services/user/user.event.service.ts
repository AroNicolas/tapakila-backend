import { AppDataSource } from "../../config/database";
import { EventStatus } from "../../entities/EnventStatus";
import { Event } from "../../entities/Event";
import { EventCategory } from "../../entities/EventCategory";

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

  static async getAllOrFilteredEvents(page: number, limit: number, filters: { date?: string; location?: string; category?: string; title?: string }) {
    const query = AppDataSource.getRepository(Event)
      .createQueryBuilder("event")
      .leftJoinAndSelect("event.ticket_type", "ticket")
      .leftJoinAndSelect("event.image", "image")
      .where("event.event_date > NOW()")
      .andWhere("event.status = :status", { status: EventStatus.PUBLISHED });
  
    if (filters.date) query.andWhere("DATE(event.event_date) = :date", { date: filters.date });
    if (filters.location) query.andWhere("LOWER(event.location) LIKE LOWER(:location)", { location: `%${filters.location}%` });
    if (filters.category) query.andWhere("event.category = :category", { category: filters.category });
    if (filters.title) query.andWhere("LOWER(event.title) LIKE LOWER(:title)", { title: `%${filters.title}%` });
  
    const [events, total] =  await query.orderBy("event.event_date", "ASC").skip((page - 1) * limit).take(limit).getManyAndCount();
    return [events, total];
  }

  static async getAllLocations(): Promise<string[]> {
    const result = await AppDataSource.getRepository(Event)
      .createQueryBuilder("event")
      .select("DISTINCT event.location", "location")
      .orderBy("event.location", "ASC")
      .getRawMany();
  
    return result.map(row => row.location);
  }
  
  static async getAllCategories(): Promise<string[]> {
    return Object.values(EventCategory);
  }
}
