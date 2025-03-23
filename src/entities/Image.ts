import { Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import { Event } from "./Event";

@Entity()
export class Image {
  @PrimaryGeneratedColumn("uuid")
  id_image: string;

  @Column("text")
  url: string;

  @ManyToOne(() => Event, (event) => event.id_event, { onDelete: "CASCADE" })
  event: Event;
}
