import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
} from "typeorm";

import { User } from "./User";
import { Listing } from "./Listing";

@Entity()
export class PDF {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "date_generated", type: "bigint" })
  dateGenerated: number; //unix

  @ManyToOne((type) => Listing, { nullable: true })
  @JoinColumn({ name: "listing" })
  listing: Listing;

  @ManyToOne((type) => User)
  @JoinColumn({ name: "user" })
  user: User;

  @Column()
  type: string;

  @Column({ type: "bytea", name: "pdf_data" })
  pdfData: Buffer;

  @BeforeInsert()
  setDefaultDateGenerated() {
    this.dateGenerated = Math.floor(Date.now() / 1000);
  }
}
