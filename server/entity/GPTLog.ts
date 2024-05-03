import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  BeforeInsert,
} from "typeorm";
import { Listing } from "./Listing";
import { User } from "./User";
import { AutoApply } from "./AutoApply";

@Entity()
export class GPTLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text" })
  input: string;

  @Column({ type: "json", nullable: true })
  response: any | null; // 'json' type will allow you to store the response object directly

  @Column({ type: "text", nullable: true })
  error: string | null;

  @Column({ type: "int", name: "prompt_tokens", nullable: true })
  promptTokens: number | null; // Number of tokens used for the request

  @Column({ type: "int", name: "completion_tokens", nullable: true })
  completionTokens: number | null; // Number of tokens used for the request

  @Column({ type: "text", nullable: true })
  model: string | null;

  @Column({ default: false })
  failedFlag: boolean; // Indicates whether the entry was invalid and needed to be retried

  @Column({ name: "batch_id", type: "bigint", nullable: true })
  batchId: number | null;

  @Column({ type: "int", name: "prev_attempt_id", nullable: true })
  prevAttemptId: number | null;

  @Column({ name: "created_at", nullable: true, type: "bigint" })
  createdAt: number | null;

  @ManyToOne((type) => Listing, { nullable: true })
  @JoinColumn({ name: "listing" })
  listing: Listing;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "user" })
  user: User | null;

  @Column({ name: "system_flag", default: false })
  systemFlag: boolean;

  @BeforeInsert()
  setDateCreated() {
    this.createdAt = Math.floor(Date.now() / 1000);
  }
}
