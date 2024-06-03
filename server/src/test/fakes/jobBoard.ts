
import { faker } from "@faker-js/faker";
import { JobBoard } from "../../entity";

export function createFakeJobBoard() {
  const jobBoard = new JobBoard();
  jobBoard.name = faker.company.name();
  return jobBoard;
}
