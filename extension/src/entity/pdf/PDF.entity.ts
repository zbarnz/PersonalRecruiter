import { Listing } from "../listing/Listing.entity";
import { User } from "../user/User.entity";
import { AutoApply } from "../auto_apply/AutoApply.entity";

export class PDF {
  id: number;
  dateGenerated: Date;
  user: User;
  autoApply: AutoApply
  type: string;
  pdfData: Buffer;

  constructor() {}
}
