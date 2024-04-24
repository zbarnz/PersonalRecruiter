import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";

import { User } from "./User";
import { JobBoard } from "./JobBoard";

@Entity()
export class Exception {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => JobBoard)
  @JoinColumn({ name: "job_board_id" })
  jobBoardId: JobBoard;

  @Column({ name: "listing_id" })
  listingId: string;

  @Column({ name: "date_updated" })
  dateUpdated: number; //unix

  @Column({ name: "reason" })
  reason: string;

  @ManyToOne((type) => User)
  @JoinColumn({ name: "user_id" })
  userId: User;
}
