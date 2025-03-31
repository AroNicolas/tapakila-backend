import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Account } from "./Account";
import { ReservationStatus } from "./ReservationStatus";
import { Event } from "./Event";
import { ReservationTicket } from "./ReservationTicket";

@Entity()
export class Reservation {
    @PrimaryGeneratedColumn("uuid")
    id_reservation: string;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    reserved_at: Date;

    @Column({ type: "enum", enum: ReservationStatus, default: ReservationStatus.CONFIRMED })
    status: ReservationStatus;

    @ManyToOne(() => Account, account => account.id_account, { onDelete: "CASCADE" })
    account: Account;

    @ManyToOne(() => Event, event => event.id_event, { onDelete: "CASCADE" })
    event: Event;

    @OneToMany(() => ReservationTicket, (rt) => rt.reservation)
    reservation_ticket: ReservationTicket[];
}