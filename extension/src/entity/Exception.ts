import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BeforeUpdate,
} from "typeorm";

import { User } from "./User";
import { JobBoard } from "./JobBoard";

@Entity()
export class Exception {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => JobBoard)
  @JoinColumn({ name: "job_board" })
  jobBoard: JobBoard;

  @Column({ name: "listing_id" })
  listingId: string;

  @Column({ name: "date_updated", type: "bigint" })
  dateUpdated: number; //unix

  @Column({ name: "reason" })
  reason: string;

  @ManyToOne((type) => User)
  @JoinColumn({ name: "user" })
  user: User;

  @BeforeUpdate()
  setDateUpdated() {
    this.dateUpdated = Math.floor(Date.now() / 1000);
  }
}
