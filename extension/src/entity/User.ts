import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

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

  @Column({ name: "created_at" }) //unix in seconds
  createdAt: number;

  @Column({ name: "points", type: "int" })
  points: number;

  @Column({ name: "summarized_resume" })
  summarizedResume: string;
}
