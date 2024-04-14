import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn
} from "typeorm";

import { User } from "./User";

@Entity()
export class Exception{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "listing_id" })
  listingId: string;

  @Column({ name: "date_updated" })
  dateUpdated: number; //unix

  @Column({ name: "reason" })
  reason: string;
}
