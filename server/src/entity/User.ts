import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from "typeorm";
import { TemplateName, AvailableTemplates } from "resume-lite";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({ name: "created_at", type: "bigint" }) //unix in seconds
  createdAt: number;

  @Column()
  points: number;

  @BeforeInsert()
  setDateCreated() {
    this.createdAt = Math.floor(Date.now() / 1000);
  }
}
