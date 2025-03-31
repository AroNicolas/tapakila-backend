import { AppDataSource } from "../../config/database";
import { ReservationStatus } from "../../entities/ReservationStatus";
import { Reservation } from "../../entities/Reservation";

export class ReservationService {
  static async cancelReservation(id_reservation: string, id: string): Promise<Reservation | null> {
    const reservationRepository = AppDataSource.getRepository(Reservation);

    const reservation = await reservationRepository.findOne({
      where: { id_reservation, account: { id_account: id } }, 
      relations: ["account"] 
    });

    if (!reservation) return null;

    reservation.status = ReservationStatus.CANCELLED;
    await reservationRepository.save(reservation);

    return reservation;
  }
}
