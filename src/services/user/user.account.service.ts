import { AppDataSource } from "../../config/database";
import { Account } from "../../entities/Account";
import { Reservation } from "../../entities/Reservation";

export class AccountService {
  static async getProfile(id_account: string) {
    return await AppDataSource.getRepository(Account)
      .findOne({ where: { id_account }, select: ["name", "email", "account_creation_date"] });
  }

  static async getFilteredPastReservations(id_account: string, filters: { date?: string; location?: string; category?: string }) {
    const query = AppDataSource.getRepository(Reservation).createQueryBuilder("reservation")
      .leftJoinAndSelect("reservation.event", "event")
      .leftJoinAndSelect("reservation.reservation_ticket", "reservation_ticket")
      .leftJoinAndSelect("reservation_ticket.ticket_type", "ticket_type")
      .where("reservation.accountId = :id_account", { id_account })
      .andWhere("reservation.reserved_at < :now", { now: new Date() });

    if (filters.date) query.andWhere("event.event_date = :date", { date: new Date(filters.date) });
    if (filters.location) query.andWhere("LOWER(event.location) LIKE LOWER(:location)", { location: `%${filters.location}%` });
    if (filters.category) query.andWhere("event.category = :category", { category: filters.category });

    const [reservations, total] = await query.getManyAndCount();  // getManyAndCount renvoie [data, totalCount]
    return [reservations, total];  // Données + Total
  }

  static async getFilteredFutureReservations(id_account: string, filters: { date?: string; location?: string; category?: string }) {
    const query = AppDataSource.getRepository(Reservation).createQueryBuilder("reservation")
      .leftJoinAndSelect("reservation.event", "event")
      .leftJoinAndSelect("reservation.reservation_ticket", "reservation_ticket")
      .leftJoinAndSelect("reservation_ticket.ticket_type", "ticket_type")
      .where("reservation.accountId = :id_account", { id_account })
      .andWhere("reservation.reserved_at > :now", { now: new Date() });

    if (filters.date) query.andWhere("event.event_date = :date", { date: new Date(filters.date) });
    if (filters.location) query.andWhere("LOWER(event.location) LIKE LOWER(:location)", { location: `%${filters.location}%` });
    if (filters.category) query.andWhere("event.category = :category", { category: filters.category });

    const [reservations, total] = await query.getManyAndCount();  // getManyAndCount renvoie [data, totalCount]
    return [reservations, total];  // Données + Total
  }
}
