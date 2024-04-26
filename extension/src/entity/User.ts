import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "first_name" })
  firstName: string;

  @Column({ name: "last_name" })
  lastName: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({ nullable: true, type: "text" })
  website: string | null;

  @Column({ name: "created_at", type: "bigint" }) //unix in seconds
  createdAt: number;

  @Column({ name: "summarized_resume", nullable: true })
  summarizedResume: string | null;

  @Column()
  skills: string[] | null;

  @Column({ name: "custom_resume_flag", default: true })
  customResumeFlag: boolean;

  @BeforeInsert()
  setDateCreated() {
    this.createdAt = Math.floor(Date.now() / 1000);
  }
}
