import { AppDataSource } from "../../config/database";
import { ReservationStatus } from "../../entities/ReservationStatus";
import { Reservation } from "../../entities/Reservation";
import { ReservationTicket } from "../../entities/ReservationTicket";
import { TicketType } from "../../entities/TicketType";
import { Event } from "../../entities/Event";
import { Account } from "../../entities/Account";

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

  static async createReservation(id: string, id_event: string, tickets: { id_ticket: string; quantity: number }[]): Promise<Reservation | null> {
    const reservationRepo = AppDataSource.getRepository(Reservation);
    const eventRepo = AppDataSource.getRepository(Event);
    const ticketRepo = AppDataSource.getRepository(TicketType);
    const reservationTicketRepo = AppDataSource.getRepository(ReservationTicket);

    // Vérifier si l'événement existe
    const event = await eventRepo.findOne({ where: { id_event } });
    if (!event) throw new Error("Événement non trouvé");

    // Créer la réservation
    const reservation = reservationRepo.create({ 
      account: { id_account: id } as Account,  
      event: { id_event } as Event  
    });
    await reservationRepo.save(reservation);

    const parsedTickets = typeof tickets === "string" ? JSON.parse(tickets) : tickets;
    if (!Array.isArray(parsedTickets)) {
      throw new Error("Format des tickets invalide, un tableau est attendu.");
    }
    
    // Ajouter les tickets
    for (const { id_ticket, quantity } of parsedTickets) {
      const ticketType = await ticketRepo.findOne({ where: { id_ticket } });
      if (!ticketType) throw new Error(`Ticket type ${id_ticket} introuvable`);

      const reservationTicket = reservationTicketRepo.create({
        reservation,
        ticket_type: ticketType,
        quantity,
      });

      await reservationTicketRepo.save(reservationTicket);
    }

    return reservation;
  }
}
