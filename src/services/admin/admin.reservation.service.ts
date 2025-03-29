import { AppDataSource } from "../../config/database";
import { Reservation } from "../../entities/Reservation";
import { ReservationStatus } from "../../entities/ReservationStatus";

export class ReservationService {
  static async getReservationsByEvent(id: string, page: number, limit: number) {
    const query = AppDataSource.getRepository(Reservation)
      .createQueryBuilder("reservation")
      .leftJoinAndSelect("reservation.event", "event")
      .leftJoinAndSelect("reservation.account", "account")
      .leftJoinAndSelect("reservation.reservation_tickets", "reservation_ticket")
      .leftJoinAndSelect("reservation_ticket.ticket_type", "ticket_type")
      .where("event.id_event = :id", { id })
      .orderBy("reservation.reserved_at", "DESC")
      .skip((page - 1) * limit)
      .take(limit);

    const [reservations, total] = await query.getManyAndCount();  // getManyAndCount renvoie [data, totalCount]
    return [reservations, total];  // Données + Total
  }

  static async cancelReservation(id: string) {
    const reservationRepository = AppDataSource.getRepository(Reservation);
    const reservation = await reservationRepository.findOne({ where: { id_reservation: id } });

    if (!reservation) return null;

    reservation.status = ReservationStatus.CANCELLED;
    await reservationRepository.save(reservation);
    return reservation;
  }
}
