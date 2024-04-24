import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";

import { User } from "./User";
import { JobBoard } from "./JobBoard";
import { Listing } from "./Listing";

@Entity()
export class AutoApply {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "date_applied" })
  dateApplied: number; //unix

  @ManyToOne((type) => Listing, { nullable: true })
  @JoinColumn({ name: "listing" })
  listing: Listing;

  @ManyToOne((type) => User)
  @JoinColumn({ name: "user" })
  user: User;

  @Column({ name: "question_answers", nullable: true, type: "jsonb" })
  questionAnswers: string | null;

  @Column({ name: "completed_flag", default: false })
  completedFlag: boolean;

  @Column({ name: "failed_flag", default: false })
  failedFlag: boolean;

  @Column({ name: "failed_reason", nullable: true })
  failedReason: string | null;
}
