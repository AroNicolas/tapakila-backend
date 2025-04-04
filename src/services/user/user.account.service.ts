import { AppDataSource } from "../../config/database";
import { Account } from "../../entities/Account";
import { Reservation } from "../../entities/Reservation";

export class AccountService {
  static async getProfile(id: string) {
    return await AppDataSource.getRepository(Account)
      .findOne({ where: { id_account: id }, select: ["name", "email", "account_creation_date"] });    
  }

  static async getFilteredPastReservations(id: string, page: number, limit: number, filters: { date?: string; location?: string; category?: string }) {
    const query = AppDataSource.getRepository(Reservation).createQueryBuilder("reservation")
      .leftJoinAndSelect("reservation.event", "event")
      .leftJoinAndSelect("reservation.reservation_ticket", "reservation_ticket")
      .leftJoinAndSelect("reservation_ticket.ticket_type", "ticket_type")
      .leftJoinAndSelect("event.image", "image")
      .where("reservation.accountIdAccount = :id_account", { id_account: id })
      .andWhere("event.event_date < NOW()");

    if (filters.date) query.andWhere("DATE(event.event_date) = DATE(:date)", { date: filters.date });
    if (filters.location) query.andWhere("LOWER(event.location) LIKE LOWER(:location)", { location: `%${filters.location}%` });
    if (filters.category) query.andWhere("event.category = :category", { category: filters.category });

    const [reservations, total] = await query.orderBy("event.event_date", "ASC").skip((page - 1) * limit).take(limit).getManyAndCount();  
    return [reservations, total];  
  }

  static async getFilteredFutureReservations(id: string, page: number, limit: number, filters: { date?: string; location?: string; category?: string }) {
    const query = AppDataSource.getRepository(Reservation).createQueryBuilder("reservation")
      .leftJoinAndSelect("reservation.event", "event")
      .leftJoinAndSelect("reservation.reservation_ticket", "reservation_ticket")
      .leftJoinAndSelect("reservation_ticket.ticket_type", "ticket_type")
      .leftJoinAndSelect("event.image", "image")
      .where("reservation.accountIdAccount = :id_account", { id_account: id })
      .andWhere("event.event_date > NOW()");

    if (filters.date) query.andWhere("DATE(event.event_date) = DATE(:date)", { date: filters.date });
    if (filters.location) query.andWhere("LOWER(event.location) LIKE LOWER(:location)", { location: `%${filters.location}%` });
    if (filters.category) query.andWhere("event.category = :category", { category: filters.category });

    const [reservations, total] = await query.orderBy("event.event_date", "ASC").skip((page - 1) * limit).take(limit).getManyAndCount();  
    return [reservations, total];  
  }
}
