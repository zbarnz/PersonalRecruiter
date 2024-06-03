import { User } from "../../entity";

import { faker } from "@faker-js/faker";

export async function createFakeUser() {
  const user = new User();
  user.email = faker.internet.email();
  user.phone = faker.phone.number();
  user.points = faker.number.int({ min: 0, max: 1000 });
  return user;
}
