import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn} from "typeorm";
import { Event } from "./Event";

@Entity()
export class Image {
  @PrimaryGeneratedColumn("uuid")
  id_image: string;

  @Column("text")
  url: string;

  @OneToOne(() => Event, (event) => event.image) // specify inverse side as a second parameter
  @JoinColumn()
  event: Event;
}
