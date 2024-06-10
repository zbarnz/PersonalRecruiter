import { faker } from "@faker-js/faker";
import { JobBoard, Listing } from "../../entity";

export function createFakeListing(jobBoard: JobBoard) {
  const listing = new Listing();
  listing.title = faker.person.jobTitle();
  listing.description = faker.lorem.paragraph();
  listing.summarizedJobDescription = faker.lorem.sentence();
  listing.company = faker.company.name();
  listing.datePosted = new Date(Math.floor(Date.now()));
  listing.employmentType = faker.helpers.arrayElements([
    "fulltime",
    "parttime",
    "contract",
  ]);
  listing.currency = faker.finance.currencyCode();
  listing.minSalary = faker.number.int({ min: 0, max: 50000 });
  listing.maxSalary = faker.number.int({ min: 50000, max: 200000 });
  listing.country = faker.location.country();
  listing.region1 = faker.location.state();
  listing.region2 = faker.location.state({ abbreviated: true });
  listing.locality = faker.location.city();
  listing.remoteFlag = faker.datatype.boolean();
  listing.directApplyFlag = faker.datatype.boolean();
  listing.closedFlag = faker.datatype.boolean();
  listing.questionsFlag = faker.datatype.boolean();
  listing.coverLetterFlag = faker.datatype.boolean();
  listing.jobBoard = jobBoard; // Assuming you have a similar function to create a fake JobBoard
  listing.jobListingId = faker.string.uuid();
  listing.requirementsObject = JSON.stringify({
    requirements: faker.lorem.sentence(),
  });
  listing.salaryObject = JSON.stringify({
    min: listing.minSalary,
    max: listing.maxSalary,
  });
  listing.oragnizationObject = JSON.stringify({
    organization: faker.company.name(),
  });
  listing.locationObject = JSON.stringify({ location: faker.location.city() });
  listing.questionsURL = faker.internet.url();
  listing.questionsObject = JSON.stringify({
    questions: faker.lorem.sentence(),
  });
  listing.directApplyFlag = faker.datatype.boolean();
  listing.remoteFlag = faker.datatype.boolean();

  return listing;
}
