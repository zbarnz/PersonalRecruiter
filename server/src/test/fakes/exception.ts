import { faker } from "@faker-js/faker";
import { Exception, JobBoard, Listing, User } from "../../entity";

export function createFakeException(
  listing: Listing,
  user: User
) {
  const exception = new Exception();
  exception.listing = listing;
  exception.reason = faker.lorem.sentence();
  exception.user = user;
  return exception;
}
