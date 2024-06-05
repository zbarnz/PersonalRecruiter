import { faker } from "@faker-js/faker";
import { AutoApply, PDF, User } from "../../entity";

export function createFakePDF(user: User, autoApply: AutoApply) {
  const pdf = new PDF();
  pdf.user = user;
  pdf.type = faker.system.fileType();
  pdf.pdfData = Buffer.from(faker.string.alpha(100), "utf-8");
  pdf.autoApply = autoApply;
  return pdf;
}
