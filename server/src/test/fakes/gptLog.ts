import { faker } from "@faker-js/faker";
import config from "../../../lib/config/local.json";
import { GPTLog, Listing, User } from "../../entity";

export function createFakeGPTLog(
  user: User,
  listing: Listing,
  log: GPTLog
): GPTLog {
  const gptLog = new GPTLog();
  gptLog.input = faker.lorem.paragraph();
  gptLog.response = { message: faker.lorem.sentence() };
  gptLog.error = faker.datatype.boolean() ? faker.lorem.sentence() : null;
  gptLog.promptTokens = faker.number.int({ min: 1, max: 1000 });
  gptLog.completionTokens = faker.number.int({ min: 1, max: 1000 });
  gptLog.model = faker.helpers.arrayElement(config.openAI.models); // TODO: use config file
  gptLog.failedFlag = faker.datatype.boolean();
  gptLog.batchId = faker.datatype.boolean()
    ? faker.number.int({ min: 1, max: 99999 })
    : null;
  gptLog.prevAttemptId =
    log.prevAttemptId ?? faker.datatype.boolean()
      ? faker.number.int({ min: 1, max: 5 })
      : null;
  gptLog.listing = listing;
  gptLog.user = user;
  gptLog.systemFlag = faker.datatype.boolean();
  return gptLog;
}

module.exports = createFakeGPTLog;
