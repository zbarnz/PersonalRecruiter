import { User } from "../../entity";

import { faker } from "@faker-js/faker";

import { passwordUtils } from "../../../lib/utils/password";

export function createFakeUser(noHash: boolean) {
  const password = faker.internet.password();
  const user = new User();

  user.email = faker.internet.email();
  user.phone = faker.phone.number();

  if (!noHash) {
    const { salt, hash } = passwordUtils.genPassword(password);
    user.salt = salt;
    user.hash = hash;
  }

  return { user, password };
}
