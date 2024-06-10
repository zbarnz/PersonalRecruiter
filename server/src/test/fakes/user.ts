import { User } from "../../entity";

import { faker } from "@faker-js/faker";

export function createFakeUser(noHash: boolean) {
  const user = new User();
  user.email = faker.internet.email();
  user.phone = faker.phone.number();
  user.points = faker.number.int({ min: 0, max: 1000 });
  if (!noHash) {
    user.hash = faker.string.alpha({ length: 256 });
    user.salt = faker.string.alpha({ length: 16 });
  }

  return { user, password: faker.internet.password() };
}
