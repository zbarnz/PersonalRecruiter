import { JobBoard } from "../job_board/JobBoard.entity";

export class Listing {
  id: number;
  title: string;
  description: string;
  summarizedJobDescription: string | null;
  company: string;
  datePosted: Date;
  dateUpdated: Date;
  employmentType: string[] | null; //eg "fulltime", "parttime", etc.
  currency: string | null;
  minSalary: number | null;
  maxSalary: number | null;
  country: string | null;
  region1: string | null;
  region2: string | null;
  locality: string | null;
  remoteFlag: boolean = false;
  directApplyFlag: boolean = false;
  closedFlag: boolean = false;
  questionsFlag: boolean | null;
  coverLetterFlag: boolean | null;
  jobBoard: JobBoard;
  jobListingId: string;
  requirementsObject: any | null;
  salaryObject: any | null;
  oragnizationObject: any | null;
  locationObject: any | null;
  questionsURL: string | null;
  questionsObject: any | null;

  constructor() {}
}
