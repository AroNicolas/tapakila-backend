import { AppDataSource } from "../../config/database";
import { Account } from "../../entities/Account";
import { Reservation } from "../../entities/Reservation";
import { MoreThan, LessThan } from "typeorm";

export class AccountService {
  static async getProfile(id_account: string) {
    return await AppDataSource.getRepository(Account)
      .findOne({ where: { id_account }, select: ["name", "email", "account_creation_date"] });
  }

  static async getPastReservations(id_account: string) {
    return await AppDataSource.getRepository(Reservation)
      .find({ where: { account: { id_account }, reserved_at: LessThan(new Date()) }, relations: ["event", "reservation_ticket", "reservation_ticket.ticket_type"] });
  }

  static async getFutureReservations(id_account: string) {
    return await AppDataSource.getRepository(Reservation)
      .find({ where: { account: { id_account }, reserved_at: MoreThan(new Date()) }, relations: ["event", "reservation_ticket", "reservation_ticket.ticket_type"] });
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

    return await query.getMany();
  }
}
