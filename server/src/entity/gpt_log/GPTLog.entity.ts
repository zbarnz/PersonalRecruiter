import { Listing } from "../listing/Listing.entity";
import { User } from "../user/User.entity";

export class GPTLog {
  id: number;
  input: string;
  response: any | null;
  error: string | null;
  promptTokens: number | null;
  completionTokens: number | null;
  model: string | null;
  failedFlag: boolean;
  batchId: number | null;
  prevAttemptId: number | null;
  createdAt: Date | null;
  listing: Listing;
  user: User | null;
  systemFlag: boolean;

  constructor() {}
}
