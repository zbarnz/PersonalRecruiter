import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  Unique,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm";

import { JobBoard } from "./JobBoard";

@Unique(["jobListingId", "jobBoard"])
@Entity()
export class Listing {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ name: "summarized_job_description", nullable: true })
  summarizedJobDescription: string | null;

  @Column({ nullable: true, type: "text" })
  company: string;

  @Column({ name: "date_posted", type: "bigint" })
  datePosted: number;

  @Column({ name: "date_updated", type: "bigint" })
  dateUpdated: number;

  @Column({
    name: "employment_type",
    nullable: true,
    type: "text",
    array: true,
  })
  employmentType: string[] | null; //eg "fulltime", "parttime", etc.

  @Column({ nullable: true, type: "text" })
  currency: string | null;

  @Column({ name: "min_salary", nullable: true, type: "int" })
  minSalary: number | null;

  @Column({ name: "max_salary", nullable: true, type: "int" })
  maxSalary: number | null;

  @Column({ nullable: true, type: "text" })
  country: string | null;

  @Column({ nullable: true, type: "text" })
  region1: string | null;

  @Column({ nullable: true, type: "text" })
  region2: string | null;

  @Column({ nullable: true, type: "text" })
  locality: string | null;

  @Column({ name: "remote_flag", default: false })
  remoteFlag: boolean = false;

  @Column({ name: "direct_apply_flag", default: false })
  directApplyFlag: boolean = false;

  @Column({ name: "closed_flag", default: false })
  closedFlag: boolean = false;

  @Column({ name: "questions_flag", nullable: true })
  questionsFlag: boolean | null;

  @Column({ name: "cover_letter_flag", nullable: true })
  coverLetterFlag: boolean | null;

  @ManyToOne((type) => JobBoard)
  @JoinColumn({ name: "job_board" })
  jobBoard: JobBoard;

  @Column({ name: "job_listing_id" })
  jobListingId: string;

  @Column({ name: "requirements_object", nullable: true, type: "jsonb" })
  requirementsObject: any | null;

  @Column({ name: "salary_object", nullable: true, type: "jsonb" })
  salaryObject: any | null;

  @Column({ name: "oragnization_object", nullable: true, type: "jsonb" })
  oragnizationObject: any | null;

  @Column({ name: "location_object", nullable: true, type: "jsonb" })
  locationObject: any | null;

  @Column({ name: "questions_url", nullable: true })
  questionsURL: string | null;

  @Column({ name: "questions_object", nullable: true, type: "jsonb" })
  questionsObject: any | null;

  @BeforeInsert()
  setDateCreated() {
    this.datePosted = Math.floor(Date.now() / 1000);
    this.dateUpdated = Math.floor(Date.now() / 1000);
  }

  @BeforeUpdate()
  setDateUpdated() {
    this.dateUpdated = Math.floor(Date.now() / 1000);
  }
}
