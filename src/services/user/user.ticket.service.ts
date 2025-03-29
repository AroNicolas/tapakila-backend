import { AppDataSource } from "../../config/database";
import { TicketType } from "../../entities/TicketType";
import { ReservationTicket } from "../../entities/ReservationTicket";

export class TicketService {
  // Récupérer le nombre de tickets disponibles pour un type de ticket et un événement donné
  static async getAvailableTickets(id_event: string, id_ticket_type: string): Promise<number | null> {
    const ticketRepository = AppDataSource.getRepository(TicketType);
    const reservationTicketRepository = AppDataSource.getRepository(ReservationTicket);

    // Récupérer le type de ticket pour connaître son buying_limit
    const ticket = await ticketRepository.findOne({ where: { id_ticket: id_ticket_type, event: { id_event } } });

    if (!ticket) return null;

    // Récupérer la quantité totale réservée pour ce ticket
    const totalReserved = await reservationTicketRepository
      .createQueryBuilder("reservation_ticket")
      .leftJoin("reservation_ticket.reservation", "reservation")
      .where("reservation_ticket.ticket_type = :id_ticket_type", { id_ticket_type })
      .andWhere("reservation.event = :id_event", { id_event })
      .andWhere("reservation.status != 'cancelled'") // Ignorer les réservations annulées
      .select("COALESCE(SUM(reservation_ticket.quantity), 0)", "totalReserved")
      .getRawOne();

    const totalQuantityReserved = totalReserved?.totalReserved || 0;

    // Calcul du nombre de tickets disponibles
    let availableQuantity = ticket.buying_limit - totalQuantityReserved;

    // Empêcher un nombre négatif
    if (availableQuantity < 0) availableQuantity = 0;

    // Mettre à jour la disponibilité du ticket si besoin
    if (availableQuantity === 0 && ticket.disponibility) {
      ticket.disponibility = false;
      await ticketRepository.save(ticket);
    } else if (availableQuantity > 0 && !ticket.disponibility) {
      ticket.disponibility = true;
      await ticketRepository.save(ticket);
    }

    return availableQuantity;
  }
}
