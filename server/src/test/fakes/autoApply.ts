import { AutoApply, Listing, User } from "../../entity";

export function createFakeAutoApply(user: User, listing: Listing) {
  const autoApply = new AutoApply();
  autoApply.listing = listing;
  autoApply.user = user;
  autoApply.customCoverLetter = false;
  autoApply.customResume = false;
  return autoApply;
}
