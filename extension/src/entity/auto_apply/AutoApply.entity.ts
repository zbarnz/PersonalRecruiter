import { Listing } from "../listing/Listing.entity";
import { User } from "../user/User.entity";

export class AutoApply {
  id: number;
  dateApplied: Date;
  listing: Listing;
  user: User;
  questionAnswers: string | null;
  completedFlag: boolean;
  failedFlag: boolean;
  failedReason: string | null;
  customCoverLetter: boolean;
  customResume: boolean
  constructor() {}
}
