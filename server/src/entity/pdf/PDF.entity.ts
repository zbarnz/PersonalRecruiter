import { Listing } from "../listing/Listing.entity";
import { User } from "../user/User.entity";

export class PDF {
  id: number;
  dateGenerated: Date;
  listing: Listing;
  user: User;
  type: string;
  pdfData: Buffer;

  constructor() {}
}
