import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class JobBoard {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  // might want to add some configuration stuff per job board so leaving this heretyr
}
