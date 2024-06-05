import { JobBoard } from "../job_board/JobBoard.entity";
import { Listing } from "../listing/Listing.entity";
import { User } from "../user/User.entity";

export class Exception {
  id: number;
  jobBoard: JobBoard;
  listing: Listing;
  dateUpdated: Date;
  reason: string;
  user: User;

  constructor() {}
}
