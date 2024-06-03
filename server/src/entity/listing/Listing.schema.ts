import { EntitySchema } from "typeorm";
import { Listing } from "./Listing.entity";
import { JobBoard } from "../job_board/JobBoard.entity";

export const ListingSchema = new EntitySchema<Listing>({
  name: Listing.name,
  target: Listing,
  tableName: "listing",
  uniques: [
    {
      name: "UQ_jobListingId_jobBoard",
      columns: ["jobListingId", "jobBoard"],
    },
  ],
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    title: {
      type: "varchar",
    },
    description: {
      type: "varchar",
    },
    summarizedJobDescription: {
      type: "varchar",
      nullable: true,
      name: "summarized_job_description",
    },
    company: {
      type: "text",
      nullable: true,
    },
    datePosted: {
      type: "timestamptz",
      name: "date_posted",
      createDate: true,
    },
    dateUpdated: {
      type: "timestamptz",
      name: "date_updated",
      updateDate: true,
    },
    employmentType: {
      type: "text",
      nullable: true,
      array: true,
      name: "employment_type",
    },
    currency: {
      type: "text",
      nullable: true,
    },
    minSalary: {
      type: Number,
      nullable: true,
      name: "min_salary",
    },
    maxSalary: {
      type: Number,
      nullable: true,
      name: "max_salary",
    },
    country: {
      type: "text",
      nullable: true,
    },
    region1: {
      type: "text",
      nullable: true,
    },
    region2: {
      type: "text",
      nullable: true,
    },
    locality: {
      type: "text",
      nullable: true,
    },
    remoteFlag: {
      type: "boolean",
      default: false,
      name: "remote_flag",
    },
    directApplyFlag: {
      type: "boolean",
      default: false,
      name: "direct_apply_flag",
    },
    closedFlag: {
      type: "boolean",
      default: false,
      name: "closed_flag",
    },
    questionsFlag: {
      type: "boolean",
      nullable: true,
      name: "questions_flag",
    },
    coverLetterFlag: {
      type: "boolean",
      nullable: true,
      name: "cover_letter_flag",
    },
    jobListingId: {
      type: "varchar",
      name: "job_listing_id",
    },
    requirementsObject: {
      type: "jsonb",
      nullable: true,
      name: "requirements_object",
    },
    salaryObject: {
      type: "jsonb",
      nullable: true,
      name: "salary_object",
    },
    oragnizationObject: {
      type: "jsonb",
      nullable: true,
      name: "oragnization_object",
    },
    locationObject: {
      type: "jsonb",
      nullable: true,
      name: "location_object",
    },
    questionsURL: {
      type: "varchar",
      nullable: true,
      name: "questions_url",
    },
    questionsObject: {
      type: "jsonb",
      nullable: true,
      name: "questions_object",
    },
  },
  relations: {
    jobBoard: {
      type: "many-to-one",
      target: JobBoard.name,
      joinColumn: {
        name: "job_board",
      },
    },
  },
});
