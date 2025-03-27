import { AppDataSource } from "../../config/database";
import { Event } from "../../entities/Event";

export class EventService {
  static async getAllEvents(page: number, limit: number) {
    return await AppDataSource.getRepository(Event)
      .createQueryBuilder("event")
      .leftJoinAndSelect("event.ticket_type", "ticket")
      .leftJoinAndSelect("event.image", "image")
      .where("event.event_date > NOW()")
      .orderBy("event.event_date", "ASC")
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
  }

  static async getEventById(id_event: string) {
    return await AppDataSource.getRepository(Event)
      .createQueryBuilder("event")
      .leftJoinAndSelect("event.ticket_type", "ticket")
      .leftJoinAndSelect("event.image", "image")
      .where("event.id = :id_event", { id_event })
      .getOne();
  }

  static async getFilteredEvents(page: number, limit: number, date?: string, location?: string, category?: string) {
    const query = AppDataSource.getRepository(Event)
      .createQueryBuilder("event")
      .leftJoinAndSelect("event.ticket_type", "ticket")
      .leftJoinAndSelect("event.image", "image");

    if (date) query.andWhere("event.event_date = :date", { date });
    if (location) query.andWhere("event.location = :location", { location });
    if (category) query.andWhere("event.category = :category", { category });

    return await query.orderBy("event.event_date", "ASC").skip((page - 1) * limit).take(limit).getMany();
  }

  static async searchEventByTitle(title: string) {
    return await AppDataSource.getRepository(Event)
      .createQueryBuilder("event")
      .leftJoinAndSelect("event.ticket_type", "ticket")
      .leftJoinAndSelect("event.image", "image")
      .where("LOWER(event.title) LIKE LOWER(:title)", { title: `%${title}%` })
      .getMany();
  }
}
