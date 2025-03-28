import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne} from "typeorm";
import { EventCategory } from "./EventCategory";
import { EventStatus } from "./EnventStatus";
import { Image } from "./Image"; 

@Entity()
export class Event {
  @PrimaryGeneratedColumn("uuid")
  id_event: string;

  @Column()
  title: string;

  @Column("text")
  description: string;

  @Column("timestamp")
  event_date: Date;

  @Column()
  location: string;

  @Column()
  organizer: string;

  @Column({ type: "enum", enum: EventCategory })
  category: EventCategory;

  @Column({ type: "enum", enum: EventStatus, default: EventStatus.DRAFT })
  status: EventStatus;

  @OneToOne(() => Image, (image) => image.event, {cascade: true})
  image: Image;  
}
