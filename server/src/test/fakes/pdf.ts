import { faker } from "@faker-js/faker";
import { Listing, PDF, User } from "../../entity";

export function createFakePDF(user: User, listing: Listing) {
  const pdf = new PDF();
  pdf.listing = listing;
  pdf.user = user;
  pdf.type = faker.system.fileType();
  pdf.pdfData = Buffer.from(faker.string.alpha(100), "utf-8");
  return pdf;
}
