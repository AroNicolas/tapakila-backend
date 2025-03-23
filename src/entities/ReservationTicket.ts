import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Reservation } from "./Reservation";
import { TicketType } from "./TicketType";

@Entity()
export class ReservationTicket {
    @PrimaryGeneratedColumn("uuid")
    id_reservation_ticket: string;

    @Column("int")
    quantity: number;

    @ManyToOne(() => Reservation, reservation => reservation.id_reservation, { onDelete: "CASCADE" })
    reservation: Reservation;

    @ManyToOne(() => TicketType, ticketType => ticketType.id_ticket, { onDelete: "CASCADE" })
    ticket_type: TicketType;
}