import { Entity, PrimaryGeneratedColumn, Column} from "typeorm";
import { UserRole } from "./UserRole";

@Entity()
export class Account {
  @PrimaryGeneratedColumn("uuid")
  id_account: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: "date", default: () => "CURRENT_DATE" })
  account_creation_date: Date;

  @Column({ type: "enum", enum: UserRole, default: UserRole.USER })
  role: UserRole;
}
