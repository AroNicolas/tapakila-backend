import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Event } from "./Event";

@Entity()
export class TicketType {
    @PrimaryGeneratedColumn("uuid")
    id_ticket: string;

    @Column()
    ticket_name: string;

    @Column("int")
    price: number;

    @Column({ default: true })
    disponibility: boolean;

    @Column("int")
    buying_limit: number;

    @ManyToOne(() => Event, event => event.id_event, { onDelete: "CASCADE" })
    event: Event;
}