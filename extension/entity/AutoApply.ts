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
export class AutoApply {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "date_applied" })
  dateApplied: number; //unix

  @Column({ name: "listing_id" })
  listingId: string;

  @ManyToOne((type) => User)
  @JoinColumn({ name: "job_board_id" })
  jobBoardId: JobBoard;

  @ManyToOne((type) => User)
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ name: "failed_flag", default: false })
  failedFlag: boolean;

  @Column({ name: "failed_reason", nullable: true })
  failedReason: string | null;
}
